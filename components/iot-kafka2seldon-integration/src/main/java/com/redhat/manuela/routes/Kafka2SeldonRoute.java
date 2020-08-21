package com.redhat.manuela.routes;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import org.apache.camel.model.OnCompletionDefinition;
import org.apache.camel.AggregationStrategy;
import org.apache.camel.Exchange;
import org.apache.camel.Message;
import org.apache.camel.Processor;
import org.apache.camel.PropertyInject;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.http.HttpMethods;
import org.apache.camel.component.kafka.KafkaConstants;
import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class Kafka2SeldonRoute extends RouteBuilder {

    @PropertyInject(value = "anomaly.seldon.endpoint", defaultValue = "http://anomaly-detection-predictor-anomaly-detection:9000/api/v1.0/predictions")

    private String anomalyEndpoint;
  
    private static final Logger LOGGER = LoggerFactory.getLogger(Kafka2SeldonRoute.class);
    
    // Keep the last 5 values of all sensor
    private static int episode_length = 5; // Amount of last values

    // HashMap to keep last 5 values for every metric
    private static  final Map<String, ArrayList<Float>> last_value_array_map = new HashMap<String, ArrayList<Float>>();
    
    //
    // Get the last 5 values for a metric. 
    // Add the current metric.
    // Retrun an empty ArrayList if less than 5 values are kept.
    //
    public static ArrayList<Float> get_list_last_values(final String id, final Float value) {

        ArrayList<Float> array = new ArrayList<Float>();

        // Get list for a id if list exists 
        if ( last_value_array_map.containsKey(id) ) 
        {
            array = last_value_array_map.get(id);
        } 

        // Add current value to the array
        array.add(0, value);

        if (array.size() > episode_length) {
            array.remove(array.size() - 1);
        }

        // LOGGER.info("**** Array :" + array);

        // Put valies into map
        last_value_array_map.put(id, array);

        // Lets return an empty array if episode not complete
        if (array.size() < episode_length) {
            return new ArrayList<Float>();
        }
        
        return array;
    }

    //
    // Helper class to parse and set the Body in messages
    //
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class BodyData {
        private String orig;
        private String values;
        private Integer anomaly;

        public String getOrig() {
          return orig;
        }
        public void setOrig(String orig) {
          this.orig = orig;
        }
        public String getValues() {
          return values;
        }
        public void setValues(String values) {
          this.values = values;
        }
        public Integer getAnomaly() {
          return anomaly;
        }
        public void setAnomaly(Integer anomaly) {
          this.anomaly = anomaly;
        }
        
        @Override
        public String toString() {
          return String.format("BodyData [orig=%s, values=%s, anomaly=%d]", orig, values, anomaly);
        }
    }

    private void readVibrationFromKafka() {
        from("kafka:{{kafka.broker.topic.vibration}}?brokers={{kafka.broker.uri}}")
          .log("Reading message from Kafka: ${body}")
          //.log("    on the topic ${headers[kafka.TOPIC]}");
          .to("direct:prepbody");
      }

    // Prepare Body data for Seldon WS call 
    // Seldon Anomaly detection required the last 5 values
    // Call Seldon only if there are enough values collected
    public void prepBody() {
        from("direct:prepbody")
        .process(new Processor() {
            public void process(Exchange exchange) {
                    ArrayList<Float> last_values;

                    Message in = exchange.getIn();
                    String body = in.getBody(String.class);
                    String[] tokens = body.split(",");
                    String location = tokens[0];
                    String device = tokens[1];
                    Float value = Float.parseFloat(tokens[2]);

                    last_values = get_list_last_values(location+"-"+device, value);
                    
                    BodyData data = new BodyData();

                    data.setOrig(body);
                    data.setValues(last_values.toString());
                    exchange.getIn().setBody(data);
            }
        })
        .log("** prepbody: ${body}")
        .choice()
            .when().simple("${body.values} == '[]' ")
                .log("** Not enough values yet to call Seldon WS")
            .otherwise()
                //.log("** To-do: Call Seldon WS");
                .to("direct:callSeldon");
                
    }

    //
    // Check the Selson reposone and set the anomaly attribute in the message
    //

    class AddResponseAggregationStrategy implements org.apache.camel.AggregationStrategy {

        public Exchange aggregate(Exchange oldExchange, Exchange newExchange) {

            Message in = newExchange.getIn();
            String response = in.getBody(String.class);
            Integer result = 0;

            LOGGER.info("**** newExchange :" + response);
           
            // Expected result
            // {"data":{"names":[],"ndarray":[1]},"meta":{}}

            try {

                final JSONObject obj = new JSONObject(response);
                final JSONObject data = obj.getJSONObject("data");
                final JSONArray ndarray = data.getJSONArray("ndarray");

                if (ndarray.length() < 1)
                {
                    LOGGER.error("**** Missing ndarray");
                } else {
                    result = ndarray.getInt(0);
                }


            } catch (JSONException e) {
                LOGGER.error("**** Unexpected JSON exception:", e);
            }

            BodyData bodyData = oldExchange.getIn().getBody(BodyData.class);

            bodyData.setAnomaly(result);

            oldExchange.getIn().setBody(bodyData);
            return oldExchange;
        }
    }



    //
    // Enrich the message with the Seldon Respone.
    // Send any anomaly to Kafka
    //
    public void callSeldon() {
        AggregationStrategy addResponse = new AddResponseAggregationStrategy();
        from("direct:callSeldon")
            .enrich("direct:seldonws", addResponse) 
        .choice()
            .when().simple("${body.anomaly} == 1 ")
                .to("direct:storeAlertInKafka")
            .otherwise()
                .log("*** No anomaly found");
            
    }

    //
    // Call Seldon Web Service with an HTTP POST
    //
    public void callSeldonWS() {

        from("direct:seldonws")
            .log("** callSeldonWS: ${body}")
            .setHeader(Exchange.HTTP_METHOD).constant(HttpMethods.POST)
            .setHeader(Exchange.CONTENT_TYPE).constant("application/json")
            .setBody(simple("{\"data\": { \"ndarray\": [${body.values}]}}"))
            .to(anomalyEndpoint);
    }



    private void storeAlertInKafka() {
        from("direct:storeAlertInKafka")
            .setHeader(KafkaConstants.KEY, constant("anomaly")) 
            .setBody().simple("${body.orig}")
            .to("kafka:{{kafka.broker.topic.anomaly}}?brokers={{kafka.broker.uri}}")
            .log("Alert sent message: ${body}");
    }

    private void storeAlertInKafkaMock() {
        from("direct:storeAlertInKafka")
            .setBody().simple("${body.orig}")
            .log("*** Sent Alert: ${body}");
    }

    private void readAlertsFromKafka() {
        from("kafka:{{kafka.broker.topic.anomaly}}?brokers={{kafka.broker.uri}}")
          .log("*** Reading message from Kafka: ${body}")
          .log("    on the topic ${headers[kafka.TOPIC]}");
      }
    

    @Override
    public void configure() throws Exception {
        readVibrationFromKafka();
        prepBody();
        callSeldon();
        callSeldonWS();
        storeAlertInKafka();
        // readAlertsFromKafka();
    }

    @Override
    public OnCompletionDefinition onCompletion() {
      return super.onCompletion();
    }
}
