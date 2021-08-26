FROM node:14-alpine

COPY package.json /test-mqtt/
WORKDIR /test-mqtt

RUN yarn install

COPY src /test-mqtt/src/
COPY tsconfig.build.json /test-mqtt/
COPY tsconfig.json /test-mqtt/

RUN yarn build

FROM node:14-alpine

# Add env
ENV LANG C.UTF-8


RUN apk add --no-cache bash curl jq && \
    curl -J -L -o /tmp/bashio.tar.gz "https://github.com/hassio-addons/bashio/archive/v0.13.1.tar.gz" && \
    mkdir /tmp/bashio && \
    tar zxvf /tmp/bashio.tar.gz --strip 1 -C /tmp/bashio && \
    mv /tmp/bashio/lib /usr/lib/bashio && \
    ln -s /usr/lib/bashio/bashio /usr/bin/bashio

# Set shell
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

WORKDIR /test-mqtt
COPY run.sh /test-mqtt/
RUN chmod a+x run.sh

COPY --from=0 /test-mqtt/dist/tsc/ /test-mqtt/
COPY --from=0 /test-mqtt/node_modules /test-mqtt/node_modules

ENTRYPOINT [ "/test-mqtt/run.sh" ]
#ENTRYPOINT [ "node", "index.js" ]
LABEL \
    io.hass.name="Test Integration via MQTT" \
    io.hass.description="Home Assistant Community Add-on for Testing MQTT" \
    io.hass.type="addon" \
    io.hass.version="1.0.0" \
    maintainer="IrtiPlays <irtiplays@gmail.com>"