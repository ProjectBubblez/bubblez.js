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
                if(options.default.nsfw){
                    if(typeof(options.default.nsfw) != "undefined" && typeof(options.default.nsfw) != "boolean") throw TypeError(`Bubblez.js: "options.default.nsfw" variable is ${typeof(options.default.nsfw)}, expected boolean or undefined`);
                    this.default.nsfw = options.default.nsfw;
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
            if(typeof(options.disableWebsocket) != "undefined" && typeof(options.disableWebsocket) != "boolean") throw TypeError(`Bubblez.js: "options.disableWebsocket" variable is ${typeof(options.disableWebsocket)}, expected boolean or undefined`);
            if(options.disableWebsocket == true){
                this.disableWebsocket = true;
            }
            if(typeof(options.showOffline) != "undefined" && typeof(options.showOffline) != "boolean") throw TypeError(`Bubblez.js: "options.showOffline" variable is ${typeof(options.showOffline)}, expected boolean or undefined`);
            if(options.showOffline == true){
                this.showOffline = true;
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
        options.nsfw = options.nsfw ?? this.default.nsfw;
        if(typeof(options.from) != "undefined" && typeof(options.from) != "string") throw TypeError(`Bubblez.js: "options.from" variable is ${typeof(options.from)}, expected string or undefined`);
        if(options.from != undefined){
            params.append('from', options.from);
        }
        if(typeof(options.locked) != "undefined" && typeof(options.locked) != "boolean") throw TypeError(`Bubblez.js: "options.locked" variable is ${typeof(options.locked)}, expected boolean or undefined`);
        if(options.locked == true){
            params.append('locked', 'true');
        }else{
            params.append('locked', 'false');
        }
        if(typeof(options.nsfw) != "undefined" && typeof(options.nsfw) != "boolean") throw TypeError(`Bubblez.js: "options.nsfw" variable is ${typeof(options.nsfw)}, expected boolean or undefined`);
        if(options.nsfw == true){
            params.append('nsfw', 'true');
        }else{
            params.append('nsfw', 'false');
        }
        params.append('token', this.token);
        if(this.verbose == true) console.log(`[Bubblez.js] Sending api request to ${this.apiurl}post/send`);
        let fetchdata = await fetch(`${this.apiurl}post/send`, {
            method: 'POST',
            body: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(r => r.json());
        if(fetchdata.error != undefined){
            throw Error(`Bubblez.js error: ${fetchdata.error}`);
        }
        if(this.verbose == true) console.log(`[Bubblez.js] Editing fetched data for usage in the Message class`);
        let postdata = {};
        postdata.postid = fetchdata.postid;
        postdata.username = this.user.username;
        postdata.content = fetchdata.post;
        postdata.from = fetchdata.from;
        postdata.locked = fetchdata.locked;
        postdata.pnsfw = fetchdata.pnsfw;
        postdata.edited = null;
        return new Message(this, postdata);
    }

    async reply(postid, message, options){
        if(!this.token) throw Error("Bubblez.js error: Not logged in yet");
        let params = new URLSearchParams();
        if(typeof(options) != "undefined" && typeof(options) != "object") throw TypeError(`Bubblez.js: "options" variable is ${typeof(options)}, expected object or undefined`);
        if(options == undefined) options = {};
        options.from = options.from ?? this.default.from;
        options.nsfw = options.nsfw ?? this.default.nsfw;
        if(options.from != undefined){
            if(typeof(options.from) != "undefined" && typeof(options.from) != "string") throw TypeError(`Bubblez.js: "options.from" variable is ${typeof(options.from)}, expected string or undefined`);
            params.append('from', options.from);
        }
        if(typeof(options.nsfw) != "undefined" && typeof(options.nsfw) != "boolean") throw TypeError(`Bubblez.js: "options.nsfw" variable is ${typeof(options.nsfw)}, expected boolean or undefined`);
        if(options.nsfw == true){
            params.append('nsfw', 'true');
        }else{
            params.append('nsfw', 'false');
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
        if(this.verbose == true) console.log(`[Bubblez.js] Sending api request to ${this.apiurl}reply/send`);
        let fetchdata = await fetch(`${this.apiurl}reply/send`, {
            method: 'POST',
            body: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(r => r.json());
        if(fetchdata.error != undefined){
            throw Error(`Bubblez.js error: ${fetchdata.error}`);
        }
        if(this.verbose == true) console.log(`[Bubblez.js] Editing fetched data for usage in the Reply class`);
        let replydata = {};
        replydata.username = this.user.username;
        replydata.content = fetchdata.reply;
        replydata.from = fetchdata.from;
        replydata.rnsfw = fetchdata.rnsfw;
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
        if(this.verbose == true) console.log(`[Bubblez.js] Sending api request to ${this.apiurl}user/get`);
        let fetchdata = await fetch(`${this.apiurl}user/get`, {
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
        if(this.verbose == true) console.log(`[Bubblez.js] Sending api request to ${this.apiurl}post/get`);
        let fetchdata = await fetch(`${this.apiurl}post/get`, {
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
        if(this.verbose == true) console.log(`[Bubblez.js] Sending api request to ${this.apiurl}post/latest`);
        let fetchdata = await fetch(`${this.apiurl}post/latest`, {
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
        if(this.verbose == true) console.log(`[Bubblez.js] Sending api request to ${this.apiurl}reply/delete`);
        let fetchdata = await fetch(`${this.apiurl}reply/delete`, {
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
        if(this.verbose == true) console.log(`[Bubblez.js] Sending api request to ${this.apiurl}post/delete`);
        let fetchdata = await fetch(`${this.apiurl}post/delete`, {
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
        if(this.verbose == true) console.log(`[Bubblez.js] Sending api request to ${this.apiurl}blog/latest`);
        let fetchdata = await fetch(`${this.apiurl}blog/latest`, {
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

    async lockPost(postid, lock){
        if(!this.token) throw Error("Bubblez.js error: Not logged in yet");
        let params = new URLSearchParams();
        if(!postid){
            throw Error("Bubblez.js error: No postid declared");
        }else{
            if(typeof(postid) != "number") throw TypeError(`Bubblez.js: "postid" variable is ${typeof(postid)}, expected number`);
            params.append('postid', postid);
        }
        if(lock === undefined){
            throw Error("Bubblez.js error: No lock declared");
        }else{
            if(typeof(lock) != "boolean") throw TypeError(`Bubblez.js: "lock" variable is ${typeof(lock)}, expected boolean`);
            if(lock == true){
                params.append('togglelock', "true");
            }else{
                params.append('togglelock', "false");
            }
        }
        params.append('token', this.token);
        if(this.verbose == true) console.log(`[Bubblez.js] Sending api request to ${this.apiurl}post/lock`);
        let fetchdata = await fetch(`${this.apiurl}post/lock`, {
            method: 'POST',
            body: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(r => r.json());
        if(fetchdata.error != undefined){
            throw Error(`Bubblez.js error: ${fetchdata.error}`);
        }
        return true;
    }

    async editPost(postid, message){
        if(!this.token) throw Error("Bubblez.js error: Not logged in yet");
        let params = new URLSearchParams();
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
            params.append('post', message);
        }
        params.append('token', this.token);
        if(this.verbose == true) console.log(`[Bubblez.js] Sending api request to ${this.apiurl}post/edit`);
        let fetchdata = await fetch(`${this.apiurl}post/edit`, {
            method: 'POST',
            body: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(r => r.json());
        if(fetchdata.error != undefined){
            throw Error(`Bubblez.js error: ${fetchdata.error}`);
        }
        return true;
    }

    async editReply(replyid, reply){
        if(!this.token) throw Error("Bubblez.js error: Not logged in yet");
        let params = new URLSearchParams();
        if(!replyid){
            throw Error("Bubblez.js error: No replyid declared");
        }else{
            if(typeof(replyid) != "number") throw TypeError(`Bubblez.js: "replyid" variable is ${typeof(replyid)}, expected number`);
            params.append('replyid', replyid);
        }
        if(!reply){
            throw Error("Bubblez.js error: No reply declared");
        }else{
            if(typeof(reply) != "string") throw TypeError(`Bubblez.js: "reply" variable is ${typeof(reply)}, expected string`);
            params.append('reply', reply);
        }
        params.append('token', this.token);
        if(this.verbose == true) console.log(`[Bubblez.js] Sending api request to ${this.apiurl}reply/edit`);
        let fetchdata = await fetch(`${this.apiurl}reply/edit`, {
            method: 'POST',
            body: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(r => r.json());
        if(fetchdata.error != undefined){
            throw Error(`Bubblez.js error: ${fetchdata.error}`);
        }
        return true;
    }

    async login(token){
        if(!token){
            throw Error("Bubblez.js error: No token declared");
        }
        if(typeof(token) != "string") throw TypeError(`Bubblez.js: "token" variable is ${typeof(token)}, expected string`);
        let params = new URLSearchParams();
        params.append('token', token);
        if(this.verbose == true) console.log(`[Bubblez.js] Sending api request to ${this.apiurl}user/check`);
        let fetchdata = await fetch(`${this.apiurl}user/check`, {
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
        if(this.verbose == true) console.log(`[Bubblez.js] Updating online status`);
        if(!this.showOffline){
            fetch(`${this.apiurl}user/ping`, {
                method: 'POST',
                body: params,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });
            setInterval(() => {
                if(this.verbose == true) console.log(`[Bubblez.js] Updating online status`);
                let params = new URLSearchParams();
                params.append('token', this.token);
                fetch(`${this.apiurl}user/ping`, {
                    method: 'POST',
                    body: params,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
            }, 240e3);
        }else if(this.verbose == true) console.log(`[Bubblez.js] Skipped updating online status`);
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