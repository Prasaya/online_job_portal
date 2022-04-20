# ESCO Portal

The project uses ESCO portal for skill parsing. Since the index files are too large for git and exceeds 1 GB limitation of github lfs, it is excluded. Only the dockerfile is included here.

## Building

Manually download portal api and extract file into this directory. The docker file expects a folder 'tomcat-esp-api' with bin, webapps, work etc.
The image is built using the following command:

```
DOCKER_BUILDKIT=1 docker build -t esco-portal .
```

## Running

Run image to be available at localhost:3030. It might take a while for tomcat to start.

```
docker run -dp 3030:8080 esco-portal
```

API will be available at localhost:5000
