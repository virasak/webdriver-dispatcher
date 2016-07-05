# webdriver-dispatcher

## Install:

    npm install webdriver-dispatcher

You also need to run remote webdriver on local machine.
The driver should access at http://localhost:4444.

## Usage:

    webdriver-dispatcher

## How it works:

Webdriver dispatcher is remote webdriver proxy. It can serve
selenium client as usual. You can run multiple machine with one
webdriver dispatcher and one remote webdriver and use HA proxy
in front of these machine. When request from client go to webdriver
dispatcher that is not the owner of the session, it will forward
to the original machine and serve client with that response.

Another use case is pack webdriver dispatcher and remote webdriver
in a docker container. Now you can run it in Docker swarm. No
HA proxy.
