const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const EventEmitter = require('events');

class client extends EventEmitter{
    constructor(options){
        super();
        if(options != undefined){
            if(options.canary == true){
                this.apiurl = 'https://canary.bubblez.app/api/v1/';
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
        if(options != undefined){
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
        return fetchdata;
    }

    async reply(postid, message, options){
        if(!this.token) throw Error("Bubblez.js error: Not logged in yet");
        let params = new URLSearchParams();
        if(typeof(options) != "undefined" && typeof(options) != "object") throw TypeError(`Bubblez.js: "options" variable is ${typeof(options)}, expected object or undefined`);
        if(options != undefined){
            if(options.from != undefined){
                if(typeof(options.from) != "undefined" && typeof(options.from) != "string") throw TypeError(`Bubblez.js: "options.from" variable is ${typeof(options.from)}, expected string or undefined`);
                params.append('from', options.from);
            }
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
        return fetchdata;
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
        return fetchdata;
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
        return fetchdata;
    }

    async getTokenUser(){
        if(!this.token) throw Error("Bubblez.js error: Not logged in yet");
        let params = new URLSearchParams();
        params.append('token', this.token);
        let fetchdata = await fetch(`${this.apiurl}checkuser`, {
            method: 'POST',
            body: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(r => r.json());
        if(fetchdata.error != undefined){
            throw Error(`Bubblez.js error: ${fetchdata.error}`);
        }
        return fetchdata;
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
        return fetchdata;
    }

    async login(token){
        if(!token){
            throw Error("Bubblez.js error: No token received");
        }
        if(typeof(token) != "string") throw TypeError(`Bubblez.js: "token" variable is ${typeof(token)}, expected string`);
        let params = new URLSearchParams();
        params.append('token', token);
        let fetchdata = await fetch(`${this.apiurl}checktoken`, {
            method: 'POST',
            body: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(r => r.json());
        if(fetchdata.error != undefined){
            throw Error(`Bubblez.js error: ${fetchdata.error}`);
        }
        this.token = token;
        this.emit("ready", fetchdata);
    }
}

module.exports = client;