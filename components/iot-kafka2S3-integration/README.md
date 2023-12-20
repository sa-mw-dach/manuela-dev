# kafka-2-S3-service

## Dev

`kamel run src/main/java/com/redhat/manuela/routes/Kafka2S3Route.java --dev --profile=openshift --configmap=iot-kafka2s3-config --secret=iot-kafka2s3-secret --name kafka2s3-dev`