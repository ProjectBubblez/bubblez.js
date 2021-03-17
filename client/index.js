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
        let params = new URLSearchParams();
        if(options != undefined){
            if(options.from != undefined){
                params.append('from', options.from);
            }
            if(options.locked == true){
                params.append('locked', 'on');
            }else{
                params.append('locked', 'off');
            }
        }
        if(!message){
            throw Error("Bubblez.js error: No message declared");
        }else{
            params.append('post', message);
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
        let params = new URLSearchParams();
        if(options != undefined){
            if(options.from != undefined){
                params.append('from', options.from);
            }
        }
        if(!postid){
            throw Error("Bubblez.js error: No postid declared");
        }else{
            params.append('postid', postid);
        }
        if(!message){
            throw Error("Bubblez.js error: No message declared");
        }else{
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
        if(!username){
            throw Error("Bubblez.js error: No username declared");
        }
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
        if(!postid){
            throw Error("Bubblez.js error: No postid declared");
        }
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