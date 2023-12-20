# Installation

1. Create a new OpenShift project
````shell
oc new-project ntt-manuela 
````

2. Install AMQ Broker operator, you could also use the OpenShift Console.

First install the Operator Group
````yaml
oc apply -f - << EOF
apiVersion: operators.coreos.com/v1
kind: OperatorGroup
metadata:
  name: ntt-manuela-og
  namespace: ntt-manuela
spec:
  targetNamespaces:
    - ntt-manuela
EOF
````
and then the operator
````yaml
oc apply -f - << EOF
apiVersion: operators.coreos.com/v1alpha1
kind: Subscription
metadata:
  name: amq-broker-rhel8
  namespace: ntt-manuela
spec:
  channel: 7.x
  installPlanApproval: Automatic
  name: amq-broker-rhel8
  source: redhat-operators
  sourceNamespace: openshift-marketplace
  startingCSV: amq-broker-operator.v7.9.3-opr-2
EOF
````

3. Install the Helm chart

The only parameter that needs to changed is **ocpAppDomain**.
You can leave the rest as is.
````shell
helm install my-release ntt-maki-manuela/ --set-string ocpAppDomain=apps.ocp4.rhlab.de
````

4. Wait until all pods are READY
````shell
$ oc get pods

amq-broker-operator-6f9f577468-dsmns     1/1     Running   0          20m
amq-mqtt-ss-0                            1/1     Running   0          20m
iot-consumer-1-khcl5                     1/1     Running   0          23m
mongo-1-bzpqb                            1/1     Running   0          23m
ntt-device-registry-5754f979cb-rgrfd     1/1     Running   0          19m
ntt-gateway-simulator-588b66f4bd-b9qlf   1/1     Running   0          23m
ntt-iot-frontend-d8878b956-sqcd7         1/1     Running   0          23m
````

5. Check the logs and optionally restart the device-registry pod

You should see, after some connection errors, gateway-announce messages coming in. If not, restart the pod.
````shell
$ oc logs ntt-device-registry-5754f979cb-rgrfd

Receiving gateway-announce with gwId: SkKrsKb4w5
Receiving gateway-announce with gwId: SkKrsKb4w5
Receiving gateway-announce with gwId: SkKrsKb4w5
Receiving gateway-announce with gwId: SkKrsKb4w5
Receiving gateway-announce with gwId: SkKrsKb4w5
````

6. Get the Routes of the ntt-device-registry and the ntt-iot-frontend
````shell
$ oc get route ntt-iot-frontend -o jsonpath='{.spec.host}{"\n"}'
ntt-iot-frontend-ntt-manuela.apps.ocp4.rhlab.de

$ oc get route ntt-device-registry -o jsonpath='{.spec.host}{"\n"}'
ntt-device-registry-ntt-manuela.apps.ocp4.rhlab.de
````

7. Open the Browser and use the REST-API with Swagger to proceed with the onboarding process

http://ntt-device-registry-ntt-manuela.apps.ocp4.rhlab.de/swagger-ui

#Cleanup

1. Uninstall the Helm Release
````shell
helm uninstall my-release
````

2. Delete the project
````shell
oc delete project ntt-manuela
````