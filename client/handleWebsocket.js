const Message = require('./../classes/Message.js');
const Reply = require('./../classes/Reply.js');

class WebsocketHandler{

    constructor(client){
        client.websocket.onopen = function(){
            if(client.verbose == true) console.log(`[Bubblez.js] Connected to the websocket`);
            setInterval(() => {
                client.websocket.send(JSON.stringify({
                    "message": "PING"
                }));
                if(client.verbose == true) console.log(`[Bubblez.js] Pinged the websocket`);
            }, 300e3);
        }

        client.websocket.onmessage = function(message){
            let messageobject = JSON.parse(message.data);
            if(client.verbose == true) console.log(`[Bubblez.js] Received message from websocket: ${messageobject.message}`);
            if(messageobject.message == "AUTHORIZATION_REQUIRED"){
                client.websocket.send(JSON.stringify({
                    "message": "SEND_TOKEN",
                    "token": client.token
                }));
            }else if(messageobject.message == "AUTHORIZED"){
                client.emit("ready", client.user);
            }else if(messageobject.message == "NEW_POST"){
                client.emit("post", new Message(client, messageobject.postdata));
            }else if(messageobject.message == "NEW_REPLY"){
                client.emit("reply", new Reply(client, messageobject.replydata), new Message(client, messageobject.postdata));
            }
        }

        client.websocket.onclose = function(){
            throw Error("Bubblez.js error: Connection closed");
        }
    }
}

module.exports = WebsocketHandler;