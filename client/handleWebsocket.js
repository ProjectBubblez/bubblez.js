const Message = require('./../classes/Message.js');
const User = require('./../classes/User.js');
const Reply = require('./../classes/Reply.js');
const WebSocket = require("ws");

class WebsocketHandler{

    constructor(client){
        this.websocketurl = client.websocketurl;
        this.client = client.websocket;
        this.lastheartbeat = 0;
        this.lastheartbeatack = 0;
        this.parent = client;
        this.connect(this);
        // client.websocket.onopen = function(){
        //     if(client.verbose == true) console.log(`[Bubblez.js] Connected to the websocket`);
        // }

        // client.websocket.onmessage = function(message){
        //     let messageobject = JSON.parse(message.data);
        //     if(client.verbose == true) console.log(`[Bubblez.js] Received message from websocket: ${messageobject.message}`);
        //     if(messageobject.message) client.emit(`WEBSOCKET_${messageobject.message}`, messageobject);
        //     if(messageobject.message == "AUTHENTICATION_REQUIRED"){
        //         client.websocket.send(JSON.stringify({
        //             "message": "SEND_TOKEN",
        //             "token": client.token,
        //             "version": 0
        //         }));
        //     }else if(messageobject.message == "AUTHENTICATED"){
        //         that.heartbeatInterval = messageobject.heartbeatinterval;
        //         client.emit("ready", client.user);
        //         that.sendheartbeat();
        //     }else if(messageobject.message == "NEW_POST"){
        //         client.emit("post", new Message(client, messageobject.postdata));
        //     }else if(messageobject.message == "NEW_REPLY"){
        //         client.emit("reply", new Reply(client, messageobject.replydata), messageobject.postid);
        //     }else if(messageobject.message == "NEW_DEVLOG"){
        //         client.emit("devlog", messageobject.postdata);
        //     }else if(messageobject.message == "HEARTBEAT_ACK"){
        //         that.lastheartbeatack = (new Date()).getTime();
        //     }else if(messageobject.message == "HEARTBEAT_MISSED"){
        //         that.heartbeatInterval = messageobject.heartbeatinterval;
        //         that.sendheartbeat();
        //     }else if(messageobject.message == "NEW_LIKE"){
        //         console.log(messageobject);
        //         if(messageobject.type == "post"){
        //             client.emit("postlike", new User(client, messageobject.userdata), new Message(client, messageobject.postdata));
        //         }else{
        //             client.emit("replylike", new User(client, messageobject.userdata), new Reply(client, messageobject.replydata), messageobject.postid);
        //         }
        //     }else if(messageobject.message == "NEW_FOLLOWER"){
        //         client.emit("follow", new User(client, messageobject.userdata));
        //     }else if(messageobject.message == "UNFOLLOWED"){
        //         client.emit("unfollow", new User(client, messageobject.userdata), parseInt(messageobject.followedid));
        //     }
        // }

        // client.websocket.onclose = function(){
        //     if(that.parent.verbose == true) console.log(`[Bubblez.js] Websocket closed, reconnecting in 5 seconds`);
        //     clearTimeout(that.timeoutheartbeat);
        //     clearTimeout(that.timeoutcheckheartbeat);
        //     setTimeout(() => {
        //         that.connect(that);
        //     }, 5e3);
        // }
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

    async connect(handler){
        var that = handler;
        clearTimeout(that.timeoutheartbeat);
        clearTimeout(that.timeoutcheckheartbeat);
        if(that.client) that.client.terminate();
        that.lastheartbeat = 0;
        that.lastheartbeatack = 0;
        delete that.timeoutcheckheartbeat;
        delete that.timeoutheartbeat;
        delete that.heartbeatInterval;
        that.client = new WebSocket(that.websocketurl);
        that.parent.websocket = that.client;
        that.client.onopen = function(){
            if(that.parent.verbose == true) console.log(`[Bubblez.js] Connected to the websocket`);
        }

        that.client.onmessage = function(message){
            let messageobject = JSON.parse(message.data);
            if(that.parent.verbose == true) console.log(`[Bubblez.js] Received message from websocket: ${messageobject.message}`);
            if(messageobject.message) that.parent.emit(`WEBSOCKET_${messageobject.message}`, messageobject);
            if(messageobject.message == "AUTHENTICATION_REQUIRED"){
                that.client.send(JSON.stringify({
                    "message": "SEND_TOKEN",
                    "token": that.parent.token,
                    "version": 1
                }));
            }else if(messageobject.message == "AUTHENTICATED"){
                that.heartbeatInterval = messageobject.heartbeatinterval;
                that.parent.emit("ready", that.parent.user);
                that.sendheartbeat();
            }else if(messageobject.message == "NEW_POST"){
                that.parent.emit("post", new Message(that.parent, messageobject.postdata));
            }else if(messageobject.message == "NEW_REPLY"){
                that.parent.emit("reply", new Reply(that.parent, messageobject.replydata), messageobject.postid);
            }else if(messageobject.message == "NEW_DEVLOG"){
                that.parent.emit("devlog", messageobject.postdata);
            }else if(messageobject.message == "HEARTBEAT_ACK"){
                that.lastheartbeatack = (new Date()).getTime();
            }else if(messageobject.message == "HEARTBEAT_MISSED"){
                that.heartbeatInterval = messageobject.heartbeatinterval;
                that.sendheartbeat();
            }else if(messageobject.message == "NEW_LIKE"){
                console.log(messageobject);
                if(messageobject.type == "post"){
                    that.parent.emit("postlike", new User(that.parent, messageobject.userdata), new Message(that.parent, messageobject.postdata));
                }else{
                    that.parent.emit("replylike", new User(that.parent, messageobject.userdata), new Reply(that.parent, messageobject.replydata), messageobject.postid);
                }
            }else if(messageobject.message == "NEW_FOLLOWER"){
                that.parent.emit("follow", new User(that.parent, messageobject.userdata));
            }else if(messageobject.message == "UNFOLLOWED"){
                that.parent.emit("unfollow", new User(that.parent, messageobject.userdata), parseInt(messageobject.followedid));
            }
        }

        that.client.onclose = function(close){
            if(that.parent.verbose == true) console.log(`[Bubblez.js] Websocket closed, reconnecting in 5 seconds. Close code: ${close.code}`);
            if(close.code == 4001) throw Error("Bubblez.js error: Websocket disconnected due to invalid json");
            if(close.code == 4002) throw Error("Bubblez.js error: Websocket disconnected due to sending requests while not being authenticated");
            if(close.code == 4003) throw Error("Bubblez.js error: Websocket disconnected due to failed authentication");
            if(close.code == 4004) throw Error("Bubblez.js error: Websocket disconnected due to a bad request");
            clearTimeout(that.timeoutheartbeat);
            clearTimeout(that.timeoutcheckheartbeat);
            setTimeout(() => {
                that.connect(that);
            }, 5e3);
        }
    }
}

module.exports = WebsocketHandler;