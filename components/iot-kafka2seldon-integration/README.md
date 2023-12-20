# kafka-2-selson service

## Dev

`kamel run src/main/java/com/redhat/manuela/routes/Kafka2SeldonRoute.java --dev --profile=openshift --configmap=iot-kafka2seldon-config --name camel-dev -d camel-jackson -d mvn:org.json:json:20200518 -d camel-http`