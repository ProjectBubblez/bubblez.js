# Bubblez.js

## About
Bubblez.js is the official module made to easily interact with the Bubblez api (https://bubblez.app/api/) in nodejs.

## Install
```
npm install bubblez.js
```

## How to use
First you should obtain your api token through the settings page.
Use the below code to start a client, replace "token here" with your api token.
The options can be removed if you don't want to use any options.
```javascript
const bubblez = require('bubblez.js');
const client = new bubblez.client("token here", { options });
```
To send a message to Bubblez use the below code, replace "message here" with the message you want to send.
Also here the options can be removed if you don't want to use any options
```javascript
client.send("message here", { options });
```
To send a reply use the below code, replace "0" with the postid and "reply here" with the reply you want to send.
```javascript
client.reply(0, "message here");
```
## Valid options
name (allowed values): Description
### Client options
canary (true/false): When set to true the canary api will be used. (Standard is false)
### Send options
from (string): Shown on Bubblez as the 'device' the message was sent from.  
locked (true/false): When set to true the sent message will be locked. (Standard is false)