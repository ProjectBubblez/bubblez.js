const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const Reply = require('./Reply.js');

class Message{
    #client;

    constructor(client, data){
        this.#client = client;
        this.postid = parseInt(data.postid);
        this.username = data.username;
        this.nsfw = data.nsfw;
        this.content = data.content;
        this.from = data.from;
        this.locked = data.locked;
        this.edited = data.edited;
        if(data.post_date) this.post_date = data.post_date;
        if(data.replies && data.replies.replies !== null){
            this.replies = [];
            data.replies.forEach(reply => {
                this.replies.push(new Reply(this.#client, reply));
            });
        }else{
            this.replies = null;
        }
    }

    async reply(message, options){
        if(!this.#client.token) throw Error("Bubblez.js error: Not logged in yet");
        let params = new URLSearchParams();
        if(typeof(options) != "undefined" && typeof(options) != "object") throw TypeError(`Bubblez.js: "options" variable is ${typeof(options)}, expected object or undefined`);
        if(options == undefined) options = {};
        options.from = options.from ?? this.#client.default.from;
        if(options.from != undefined){
            if(typeof(options.from) != "undefined" && typeof(options.from) != "string") throw TypeError(`Bubblez.js: "options.from" variable is ${typeof(options.from)}, expected string or undefined`);
            params.append('from', options.from);
        }
        if(typeof(this.postid) != "number") throw TypeError(`Bubblez.js: "this.postid" variable is ${typeof(this.postid)}, expected number`);
        params.append('postid', this.postid);
        if(!message){
            throw Error("Bubblez.js error: No message declared");
        }else{
            if(typeof(message) != "string") throw TypeError(`Bubblez.js: "message" variable is ${typeof(message)}, expected string`);
            params.append('reply', message);
        }
        params.append('token', this.#client.token);
        let fetchdata = await fetch(`${this.#client.apiurl}sendreply`, {
            method: 'POST',
            body: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(r => r.json());
        if(fetchdata.error != undefined){
            throw Error(`Bubblez.js error: ${fetchdata.error}`);
        }
        let replydata = {};
        replydata.username = this.#client.user.username;
        replydata.content = fetchdata.reply;
        replydata.from = fetchdata.from;
        replydata.replyid = fetchdata.replyid;
        return new Reply(this.#client, replydata);
    }

    async delete(){
        if(this.#client.user.username == this.username){
            if(!this.#client.token) throw Error("Bubblez.js error: Not logged in yet");
            let params = new URLSearchParams();
            params.append('postid', this.postid);
            params.append('token', this.#client.token);
            params.append('confirm', true);
            let fetchdata = await fetch(`${this.#client.apiurl}deletepost`, {
                method: 'POST',
                body: params,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(r => r.json());
            if(fetchdata.error != undefined){
                throw Error(`Bubblez.js error: ${fetchdata.error}`);
            }
            return true;
        }else{
            throw Error(`Bubblez.js error: Insufficient permissions to delete this message`);
        }
    }

    async update(){
        if(!this.#client.token) throw Error("Bubblez.js error: Not logged in yet");
        let params = new URLSearchParams();
        params.append('postid', this.postid);
        params.append('token', this.#client.token);
        let fetchdata = await fetch(`${this.#client.apiurl}getpost`, {
            method: 'POST',
            body: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then(r => r.json());
        if(fetchdata.error != undefined){
            throw Error(`Bubblez.js error: ${fetchdata.error}`);
        }
        this.postid = parseInt(fetchdata.postid);
        this.username = fetchdata.username;
        this.nsfw = fetchdata.nsfw;
        this.content = fetchdata.content;
        this.from = fetchdata.from;
        this.locked = fetchdata.locked;
        this.edited = fetchdata.edited;
        this.post_date = fetchdata.post_date;
        if(fetchdata.replies && fetchdata.replies.replies !== null){
            this.replies = [];
            fetchdata.replies.forEach(reply => {
                this.replies.push(new Reply(this.#client, reply));
            });
        }
        return this;
    }
}

module.exports = Message;