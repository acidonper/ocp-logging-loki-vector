# Openshift Logging with Loki and Vector

## Prerequisites

- Openshift 4.11+
- AWS S3 bucket and credentials
- Install elastic CRD because of an issue (*https://access.redhat.com/solutions/6990588*)

```$bash
oc create -f https://raw.githubusercontent.com/openshift/elasticsearch-operator/release-5.5/bundle/manifests/logging.openshift.io_elasticsearches.yaml
```

## Install Logging Stack

- Install Openshift Logging 5.5+ Operator

- Install Loki Operator

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

## Testing Vector Locally

- Start Local Sink API based on Javascript and NodeJS

```$bash
cd api
npm install 
npm run start
```

- Create or edit vector/vector.toml (_*it is important to modify the uri in order to specify your local machine IP_)

- Start Podman pod

```$bash
docker run \
  -d \
  -v $PWD/vector/vector.toml:/etc/vector/vector.toml:Z \
  -p 8686:8686 \
  timberio/vector:0.26.0-debian
```

- Review the api logs in the console

```$bash
...
[
  {
    message: '{"host":"18.60.164.119","user-identifier":"benefritz","datetime":"16/Jan/2023:16:17:40","method":"DELETE","request":"/booper/bopper/mooper/mopper","protocol":"HTTP/2.0","status":"501","bytes":23899,"referer":"https://names.org/observability/metrics/production"}',
    source_type: 'demo_logs',
    timestamp: '2023-01-16T16:17:40.988473975Z'
  },
  {
    message: '{"host":"48.128.135.38","user-identifier":"benefritz","datetime":"16/Jan/2023:16:17:41","method":"HEAD","request":"/do-not-access/needs-work","protocol":"HTTP/1.1","status":"410","bytes":20303,"referer":"https://for.de/controller/setup"}',
    source_type: 'demo_logs',
    timestamp: '2023-01-16T16:17:41.988470845Z'
  }
]
```


## Author

Asier Cidon @RedHat