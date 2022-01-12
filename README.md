# Bubblez.js

## About
Bubblez.js is the official module made to easily interact with the Bubblez api (https://bubblez.app/api/) in nodejs.
The bubblez.js module require nodejs version 14 or above.

## Install
```
npm install bubblez.js
```

## How to use
First you should obtain your api token through the settings page.
Use the below code to start a client, replace "token here" with your api token.
The options can be removed if you don't want to use any options.
Warning: Make sure to start contacting the bubblez api after the ready event has been fired and not before.
If the ready event hasn't been fired yet, the token hasn't been set either!
```javascript
const bubblez = require('bubblez.js');
const client = new bubblez.Client({ options });

client.once('ready', user => {
    console.log("Logged in as: " + user.username);
});

client.login("token here");
```
For documentation look at our [wiki](https://github.com/ProjectBubblez/documentation/blob/main/docs/libraries/BUBBLEZ.JS.mdhttps://github.com/ProjectBubblez/documentation/blob/main/docs/libraries/BUBBLEZ.JS.md)


- Affiliated with [Bubblez.app](https://bubblez.app/library#bubblez.js)
