# syntax=docker/dockerfile:1

FROM openjdk:8-alpine
WORKDIR /app
COPY . .
CMD /bin/sh -c './tomcat-esp-api/bin/startup.sh && tail -fn+1 ./tomcat-esp-api/logs/*'
