

.PHONY: install-seldon-operator
## Install the Seldon operator
install-seldon-operator:
	oc apply -f manifests/test-anomaly-detection-operatorgroup.yaml
	oc apply -f manifests/seldon-subscription-v1.2.0.yaml

.PHONY: delete-seldon-operator
## Delete the Seldon operator
delete-seldon-operator:
	oc delete ClusterServiceVersion seldon-operator.v1.2.0
	oc delete -f manifests/seldon-subscription-v1.2.0.yaml
	oc delete -f manifests/test-anomaly-detection-operatorgroup.yaml

.PHONY: build-container 
## Build anomaly-detection container
build-container:
	oc apply -f manifests/iot-anomaly-detection-is.yaml
	oc apply -f manifests/iot-anomaly-detection-bc.yaml 

.PHONY: delete-container 
## Delete anomaly-detection container
delete-container:
	oc delete -f manifests/iot-anomaly-detection-is.yaml
	oc delete -f manifests/iot-anomaly-detection-bc.yaml

.PHONY: create-deployment 
## Create SeldonDeployment
create-deployment:
	oc apply -f manifests/iot-anomaly-detection-seldon.yaml
	oc apply -f manifests/iot-anomaly-detection-route.yaml

.PHONY: delete-deployment 
## Delete SeldonDeployment
delete-deployment:
	oc delete -f manifests/iot-anomaly-detection-route.yaml
	oc delete -f manifests/iot-anomaly-detection-seldon.yaml

## Test Prediction
ROUTE := $(shell oc get route anomaly-detection -o jsonpath='{.spec.host}')
.PHONY: test-prediction 
test-prediction:
	@echo ROUTE IS $(ROUTE)
	curl -k -X POST -H 'Content-Type: application/json' -d '{"data": { "ndarray": [[16.1,  15.40,  15.32,  13.47,  17.70]]}}' http://$(ROUTE)/api/v1.0/predictions