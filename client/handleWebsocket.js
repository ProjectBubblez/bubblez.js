const Message = require('./../classes/Message.js');
const Reply = require('./../classes/Reply.js');
const WebSocket = require("ws");

class WebsocketHandler{

    constructor(client){
        this.websocketurl = client.websocketurl;
        this.client = client.websocket;
        this.lastheartbeat = 0;
        this.lastheartbeatack = 0;
        this.parent = client;
        var that = this;
        client.websocket.onopen = function(){
            if(client.verbose == true) console.log(`[Bubblez.js] Connected to the websocket`);
        }

        client.websocket.onmessage = function(message){
            let messageobject = JSON.parse(message.data);
            if(client.verbose == true) console.log(`[Bubblez.js] Received message from websocket: ${messageobject.message}`);
            if(messageobject.message == "AUTHENTICATION_REQUIRED"){
                client.websocket.send(JSON.stringify({
                    "message": "SEND_TOKEN",
                    "token": client.token
                }));
            }else if(messageobject.message == "AUTHENTICATED"){
                that.heartbeatInterval = messageobject.heartbeatinterval;
                client.emit("ready", client.user);
                that.sendheartbeat();
            }else if(messageobject.message == "NEW_POST"){
                client.emit("post", new Message(client, messageobject.postdata));
            }else if(messageobject.message == "NEW_REPLY"){
                client.emit("reply", new Reply(client, messageobject.replydata), new Message(client, messageobject.postdata));
            }else if(messageobject.message == "HEARTBEAT_ACK"){
                that.lastheartbeatack = (new Date()).getTime();
            }else if(messageobject.message == "HEARTBEAT_MISSED"){
                that.heartbeatInterval = messageobject.heartbeatinterval;
                that.sendheartbeat();
            }
        }

        client.websocket.onclose = function(){
            if(that.parent.verbose == true) console.log(`[Bubblez.js] Websocket closed, reconnecting in 5 seconds`);
            clearTimeout(that.timeoutheartbeat);
            clearTimeout(that.timeoutcheckheartbeat);
            setTimeout(() => {
                that.reconnect(that);
            }, 5e3);
        }
    }

    async sendheartbeat(handler){
        var that = handler ?? this;
        if(that.parent.verbose == true) console.log(`[Bubblez.js] Sending heartbeat to websocket`);
        that.client.send(JSON.stringify({ "message": "HEARTBEAT" }));
        that.lastheartbeat = (new Date()).getTime();
        clearTimeout(that.timeoutcheckheartbeat);
        that.timeoutcheckheartbeat = setTimeout(() => {
            that.checkHeartbeatOrKill(that);
        }, 5e3);
        clearTimeout(that.timeoutheartbeat);
        that.timeoutheartbeat = setTimeout(() => {
            that.sendheartbeat(that);
        }, that.heartbeatInterval);
    }

    async checkHeartbeatOrKill(handler){
        var that = handler;
        if(that.lastheartbeatack < that.lastheartbeat){
            if(that.parent.verbose == true) console.log(`[Bubblez.js] Detected zombified websocket, terminating websocket`);
            that.reconnect(that);
        }
    }

    async reconnect(handler){
        var that = handler;
        clearTimeout(that.timeoutheartbeat);
        clearTimeout(that.timeoutcheckheartbeat);
        that.client.terminate();
        that.lastheartbeat = 0;
        that.lastheartbeatack = 0;
        delete that.timeoutcheckheartbeat;
        delete that.timeoutheartbeat;
        delete that.heartbeatInterval;
        that.client = new WebSocket(that.websocketurl);
        that.client.onopen = function(){
            if(that.parent.verbose == true) console.log(`[Bubblez.js] Connected to the websocket`);
        }
        that.client.onmessage = function(message){
            let messageobject = JSON.parse(message.data);
            if(that.parent.verbose == true) console.log(`[Bubblez.js] Received message from websocket: ${messageobject.message}`);
            if(messageobject.message == "AUTHORIZATION_REQUIRED"){
                that.client.send(JSON.stringify({
                    "message": "SEND_TOKEN",
                    "token": that.parent.token
                }));
            }else if(messageobject.message == "AUTHORIZED"){
                that.heartbeatInterval = messageobject.heartbeatinterval;
                that.sendheartbeat();
            }else if(messageobject.message == "NEW_POST"){
                that.parent.emit("post", new Message(that.parent, messageobject.postdata));
            }else if(messageobject.message == "NEW_REPLY"){
                that.parent.emit("reply", new Reply(that.parent, messageobject.replydata), new Message(that.parent, messageobject.postdata));
            }else if(messageobject.message == "HEARTBEAT_ACK"){
                that.lastheartbeatack = (new Date()).getTime();
            }
        }
        that.client.onclose = function(){
            if(that.parent.verbose == true) console.log(`[Bubblez.js] Websocket closed, reconnecting in 5 seconds`);
            clearTimeout(that.timeoutheartbeat);
            clearTimeout(that.timeoutcheckheartbeat);
            setTimeout(() => {
                that.reconnect(that);
            }, 5e3);
        }
    }
}

module.exports = WebsocketHandler;