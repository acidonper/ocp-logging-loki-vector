# Openshift Logging with Loki and Vector

This repository collects information to deploy and configure the new Openshift Logging Stack base on Loki and Vector.

The idea is to deploy the mentioned solutions and be able to integrate some changes in the stack in order to parse some logs and redirect them to external systems.

## Prerequisites

- Openshift 4.11+
- AWS S3 bucket and credentials
- Install elastic CRD because of an issue (*https://access.redhat.com/solutions/6990588*)

```$bash
oc create -f https://raw.githubusercontent.com/openshift/elasticsearch-operator/release-5.5/bundle/manifests/logging.openshift.io_elasticsearches.yaml
```

## Install Logging Stack

First of all, it is required to install the required operators in order to be able to deploy the logging solution in Openshift:

- Install Openshift Logging 5.5+ Operator

- Install Loki Operator

Once the operators are ready, it is time to create the required resources to deploy Loki & Vector and redirect all the logs to the Openshift logging stack:

- Create s3 credentials

```$bash
oc create -f s3-config.yaml
```

- Create Loki instance

```$bash
oc create -f loki.yaml
```

- Create Logging instance

```$bash
oc create -f logging.yaml
```

- Configure Log Forward to storage logs

```$bash
oc create -f log-forward.yaml
```

Finally, it is required to check the Openshift Console in order to see the logs aggregated (Console -> Observe -> Logs)


## Vector

Vector is a high-performance observability data pipeline that puts organizations in control of their observability data. Collect, transform, and route all your logs, metrics, and traces to any vendors you want today and any other vendors you may want tomorrow. 

Regarding the logical data procesing architecture, it is based on the followin components:

- Sources: Enable to take in observability data from a wide variety of [sources](https://vector.dev/docs/reference/configuration/sources/)
- Transforms: Allow to transform the data through a set of [tools](https://vector.dev/docs/reference/configuration/transforms/)
- Sinks: Deliver the observability data transformed to a variety of [destinations](https://vector.dev/docs/reference/configuration/sinks/)

### Testing Vector Locally

- Start Local Sink API based on Javascript and NodeJS

```$bash
cd api
npm install 
npm run start
```

- Create or edit vector/vector.toml (_*it is important to modify the uri in order to specify your local machine IP for the containers gateway_)

- Start Podman pod

```$bash
podamn run \
  -d \
  -v $PWD/vector/vector.toml:/etc/vector/vector.toml:Z \
  -p 8686:8686 \
  timberio/vector:0.26.0-debian
```

- Review the api logs in the Vector container console and API console

```$bash
### Vector container console
{"message":"{\"host\":\"75.45.136.51\",\"user-identifier\":\"meln1ks\",\"datetime\":\"16/Jan/2023:17:08:45\",\"method\":\"PUT\",\"request\":\"/observability/metrics/production\",\"protocol\":\"HTTP/1.1\",\"status\":\"501\",\"bytes\":42655,\"referer\":\"https://up.org/wp-admin\"}","source_type":"demo_logs","timestamp":"2023-01-16T17:08:45.491798247Z"}

### API console
...
  {
    datetime: '16/Jan/2023:17:08:45',
    host: '75.45.136.51',
    method: 'put',
    protocol: 'HTTP/1.1',
    referer: 'https://up.org/wp-admin',
    request: '/observability/metrics/production',
    status: '501',
    'user-identifier': 'meln1ks'
  }
```

IMPORTANT: It is important to pay special attention to the vector.toml in order to analyse the transform rules integrated


## Author

Asier Cidon @RedHat