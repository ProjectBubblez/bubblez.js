const fetch = require('node-fetch');
const WebSocket = require("ws");
const { URLSearchParams } = require('url');
const EventEmitter = require('events');
const Message = require('./../classes/Message.js');
const User = require('./../classes/User.js');
const Reply = require('./../classes/Reply.js');
const WebsocketHandler = require("./handleWebsocket.js");

class Client extends EventEmitter{
    constructor(options){
        super();
        this.default = {};
        if(typeof(options) != "undefined" && typeof(options) != "object") throw TypeError(`Bubblez.js: "options" variable is ${typeof(options)}, expected object or undefined`);
        if(options != undefined){
            if(typeof(options.canary) != "undefined" && typeof(options.canary) != "boolean") throw TypeError(`Bubblez.js: "options.canary" variable is ${typeof(options.canary)}, expected boolean or undefined`);
            if(options.canary == true){
                this.apiurl = 'https://canary.bubblez.app/api/v1/';
            }
            if(typeof(options.verbose) != "undefined" && typeof(options.verbose) != "boolean") throw TypeError(`Bubblez.js: "options.verbose" variable is ${typeof(options.verbose)}, expected boolean or undefined`);
            if(options.verbose == true){
                this.verbose = true;
            }
            if(typeof(options.default) != "undefined" && typeof(options.default) != "object") throw TypeError(`Bubblez.js: "options.default" variable is ${typeof(options.default)}, expected object or undefined`);
            if(options.default != undefined){
                if(options.default.from){
                    if(typeof(options.default.from) != "undefined" && typeof(options.default.from) != "string") throw TypeError(`Bubblez.js: "options.default.from" variable is ${typeof(options.default.from)}, expected string or undefined`);
                    this.default.from = options.default.from;
                }
                if(options.default.locked){
                    if(typeof(options.default.locked) != "undefined" && typeof(options.default.locked) != "boolean") throw TypeError(`Bubblez.js: "options.default.locked" variable is ${typeof(options.default.locked)}, expected boolean or undefined`);
                    this.default.locked = options.default.locked;
                }
            }
            if(typeof(options.websocketurl) != "undefined" && typeof(options.websocketurl) != "string") throw TypeError(`Bubblez.js: "options.websocketurl" variable is ${typeof(options.websocketurl)}, expected string or undefined`);
            if(options.websocketurl) {
                this.websocketurl = options.websocketurl;
            }
            if(typeof(options.apiurl) != "undefined" && typeof(options.apiurl) != "string") throw TypeError(`Bubblez.js: "options.apiurl" variable is ${typeof(options.apiurl)}, expected string or undefined`);
            if(options.apiurl) {
                this.apiurl = options.apiurl;
            }
            if(typeof(options.disableWebsocket) != "undefined" && typeof(options.disableWebsocket) != "boolean") throw TypeError(`Bubblez.js: "options.disableWebsocket" variable is ${typeof(options.apiurl)}, expected boolean or undefined`);
            if(options.disableWebsocket == true){
                this.disableWebsocket = true;
            }
        }
        if(!this.apiurl){
            this.apiurl = 'https://bubblez.app/api/v1/';
        }
    }

    async send(message, options){
        if(!this.token) throw Error("Bubblez.js error: Not logged in yet");
        let params = new URLSearchParams();
        if(!message){
            throw Error("Bubblez.js error: No message declared");
        }else{
            if(typeof(message) != "string") throw TypeError(`Bubblez.js: "message" variable is ${typeof(message)}, expected string`);
            params.append('post', message);
        }
        if(typeof(options) != "undefined" && typeof(options) != "object") throw TypeError(`Bubblez.js: "options" variable is ${typeof(options)}, expected object or undefined`);
        if(options == undefined) options = {};
        options.from = options.from ?? this.default.from;
        options.locked = options.locked ?? this.default.locked;
        if(typeof(options.from) != "undefined" && typeof(options.from) != "string") throw TypeError(`Bubblez.js: "options.from" variable is ${typeof(options.from)}, expected string or undefined`);
        if(options.from != undefined){
            params.append('from', options.from);
        }
        if(typeof(options.locked) != "undefined" && typeof(options.locked) != "boolean") throw TypeError(`Bubblez.js: "options.locked" variable is ${typeof(options.locked)}, expected boolean or undefined`);
        if(options.locked == true){
            params.append('locked', 'on');
        }else if(options.locked == false){
            params.append('locked', 'off');
        }
        params.append('token', this.token);
        let fetchdata = await fetch(`${this.apiurl}sendpost`, {
            method: 'POST',
            body: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(r => r.json());
        if(fetchdata.error != undefined){
            throw Error(`Bubblez.js error: ${fetchdata.error}`);
        }
        let postdata = {};
        postdata.postid = fetchdata.postid;
        postdata.username = this.user.username;
        postdata.nsfw = this.user.nsfw;
        postdata.content = fetchdata.post;
        postdata.from = fetchdata.from;
        postdata.locked = fetchdata.locked;
        postdata.edited = null;
        return new Message(this, postdata);
    }

    async reply(postid, message, options){
        if(!this.token) throw Error("Bubblez.js error: Not logged in yet");
        let params = new URLSearchParams();
        if(typeof(options) != "undefined" && typeof(options) != "object") throw TypeError(`Bubblez.js: "options" variable is ${typeof(options)}, expected object or undefined`);
        if(options == undefined) options = {};
        options.from = options.from ?? this.default.from;
        if(options.from != undefined){
            if(typeof(options.from) != "undefined" && typeof(options.from) != "string") throw TypeError(`Bubblez.js: "options.from" variable is ${typeof(options.from)}, expected string or undefined`);
            params.append('from', options.from);
        }
        if(!postid){
            throw Error("Bubblez.js error: No postid declared");
        }else{
            if(typeof(postid) != "number") throw TypeError(`Bubblez.js: "postid" variable is ${typeof(postid)}, expected number`);
            params.append('postid', postid);
        }
        if(!message){
            throw Error("Bubblez.js error: No message declared");
        }else{
            if(typeof(message) != "string") throw TypeError(`Bubblez.js: "message" variable is ${typeof(message)}, expected string`);
            params.append('reply', message);
        }
        params.append('token', this.token);
        let fetchdata = await fetch(`${this.apiurl}sendreply`, {
            method: 'POST',
            body: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(r => r.json());
        if(fetchdata.error != undefined){
            throw Error(`Bubblez.js error: ${fetchdata.error}`);
        }
        let replydata = {};
        replydata.username = this.user.username;
        replydata.content = fetchdata.reply;
        replydata.from = fetchdata.from;
        replydata.replyid = fetchdata.replyid;
        return new Reply(this, replydata);
    }

    async getUser(username){
        if(!this.token) throw Error("Bubblez.js error: Not logged in yet");
        if(!username){
            throw Error("Bubblez.js error: No username declared");
        }
        if(typeof(username) != "string") throw TypeError(`Bubblez.js: "username" variable is ${typeof(username)}, expected string`);
        let params = new URLSearchParams();
        params.append('username', username);
        params.append('token', this.token);
        let fetchdata = await fetch(`${this.apiurl}getuser`, {
            method: 'POST',
            body: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(r => r.json());
        if(fetchdata.error != undefined){
            throw Error(`Bubblez.js error: ${fetchdata.error}`);
        }
        return new User(this, fetchdata);
    }

    async getPost(postid){
        if(!this.token) throw Error("Bubblez.js error: Not logged in yet");
        if(!postid){
            throw Error("Bubblez.js error: No postid declared");
        }
        if(typeof(postid) != "number") throw TypeError(`Bubblez.js: "postid" variable is ${typeof(postid)}, expected number`);
        let params = new URLSearchParams();
        params.append('postid', postid);
        params.append('token', this.token);
        let fetchdata = await fetch(`${this.apiurl}getpost`, {
            method: 'POST',
            body: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(r => r.json());
        if(fetchdata.error != undefined){
            throw Error(`Bubblez.js error: ${fetchdata.error}`);
        }
        return new Message(this, fetchdata);
    }

    async latestPost(){
        if(!this.token) throw Error("Bubblez.js error: Not logged in yet");
        let params = new URLSearchParams();
        params.append('token', this.token);
        let fetchdata = await fetch(`${this.apiurl}latestpost`, {
            method: 'POST',
            body: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(r => r.json());
        if(fetchdata.error != undefined){
            throw Error(`Bubblez.js error: ${fetchdata.error}`);
        }
        return fetchdata.postid;
    }

    async deleteReply(replyid){
        if(!this.token) throw Error("Bubblez.js error: Not logged in yet");
        let params = new URLSearchParams();
        if(!replyid){
            throw Error("Bubblez.js error: No replyid declared");
        }else{
            if(typeof(replyid) != "number") throw TypeError(`Bubblez.js: "replyid" variable is ${typeof(replyid)}, expected number`);
            params.append('replyid', replyid);
        }
        params.append('token', this.token);
        params.append('confirm', true);
        let fetchdata = await fetch(`${this.apiurl}deletereply`, {
            method: 'POST',
            body: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(r => r.json());
        if(fetchdata.error != undefined){
            throw Error(`Bubblez.js error: ${fetchdata.error}`);
        }
        return true;
    }

    async deleteMessage(postid){
        if(!this.token) throw Error("Bubblez.js error: Not logged in yet");
        let params = new URLSearchParams();
        if(!postid){
            throw Error("Bubblez.js error: No postid declared");
        }else{
            if(typeof(postid) != "number") throw TypeError(`Bubblez.js: "postid" variable is ${typeof(postid)}, expected number`);
            params.append('postid', postid);
        }
        params.append('token', this.token);
        params.append('confirm', true);
        let fetchdata = await fetch(`${this.apiurl}deletepost`, {
            method: 'POST',
            body: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(r => r.json());
        if(fetchdata.error != undefined){
            throw Error(`Bubblez.js error: ${fetchdata.error}`);
        }
        return true;
    }

    async latestBlog(){
        if(!this.token) throw Error("Bubblez.js error: Not logged in yet");
        let params = new URLSearchParams();
        params.append('token', this.token);
        let fetchdata = await fetch(`${this.apiurl}latestblog`, {
            method: 'POST',
            body: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(r => r.json());
        if(fetchdata.error != undefined){
            throw Error(`Bubblez.js error: ${fetchdata.error}`);
        }
        delete fetchdata["200"];
        return fetchdata;
    }

    async login(token){
        if(!token){
            throw Error("Bubblez.js error: No token declared");
        }
        if(typeof(token) != "string") throw TypeError(`Bubblez.js: "token" variable is ${typeof(token)}, expected string`);
        let params = new URLSearchParams();
        params.append('token', token);
        if(this.verbose == true) console.log(`[Bubblez.js] Sending api request to ${this.apiurl}checkuser`);
        let fetchdata = await fetch(`${this.apiurl}checkuser`, {
            method: 'POST',
            body: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(r => r.json());
        if(fetchdata.error != undefined){
            throw Error(`Bubblez.js error: ${fetchdata.error}`);
        }
        if(this.verbose == true) console.log(`[Bubblez.js] Token verified`);
        this.token = token;
        this.user = new User(this, fetchdata);
        if(!this.disableWebsocket){
            if(this.verbose == true) console.log(`[Bubblez.js] Connecting to websocket at ${this.websocketurl}`);
            this.websocket = new WebSocket(this.websocketurl);
            new WebsocketHandler(this);
            return;
        }else if(this.verbose == true) console.log(`[Bubblez.js] Skipped connecting to websocket`);
        this.emit("ready", this.user);
    }
}

module.exports = Client;