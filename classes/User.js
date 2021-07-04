const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const Message = require('./Message.js');
const Reply = require('./Reply.js');

class User{
    #client;

    constructor(client, data){
        this.#client = client;
        if(data.email){
            this.private = {};
            this.private.email = data.email;
            this.private.dob = data.dob;
        }
        this.uuid = data.uuid;
        this.username = data.username;
        this.displayname = data.displayname;
        this.pfp = data.pfp;
        this.banner = data.banner;
        this.coins = data.coins;
        this.rank = data.rank;
        this.eventr = data.eventr;
        this.patreon = data.patreon;
        this.booster = data.booster;
        this.bio = data.bio;
        this.nsfw = data.nsfw;
        this.pronoun = data.pronoun;
        this.created_at = data.created_at;
        if(data.posts && data.posts.posts !== null){
            this.posts = [];
            data.posts.forEach(post => {
                this.posts.push(new Message(this.#client, post));
            });
        }else{
            this.posts = null;
        }
        if(data.replies && data.replies !== null){
            this.replies = [];
            data.replies.forEach(reply => {
                this.replies.push(new Reply(this.#client, reply));
            });
        }else{
            this.replies = null;
        }
    }

    async update(){
        if(this.private){
            if(!this.#client.token) throw Error("Bubblez.js error: Not logged in yet");
            let params = new URLSearchParams();
            params.append('token', this.#client.token);
            let fetchdata = await fetch(`${this.#client.apiurl}checkuser`, {
                method: 'POST',
                body: params,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(r => r.json());
            if(fetchdata.error != undefined){
                throw Error(`Bubblez.js error: ${fetchdata.error}`);
            }
            this.private = {};
            this.private.email = fetchdata.email;
            this.private.dob = fetchdata.dob;
            this.uuid = fetchdata.uuid;
            this.username = fetchdata.username;
            this.displayname = fetchdata.displayname;
            this.pfp = fetchdata.pfp;
            this.banner = fetchdata.banner;
            this.coins = fetchdata.coins;
            this.rank = fetchdata.rank;
            this.eventr = fetchdata.eventr;
            this.patreon = fetchdata.patreon;
            this.booster = fetchdata.booster;
            this.bio = fetchdata.bio;
            this.nsfw = fetchdata.nsfw;
            this.pronoun = fetchdata.pronoun;
            this.ban = null;
            this.created_at = fetchdata.created_at;
            this.last_posted = null;
            if(fetchdata.posts && fetchdata.posts.posts !== null){
                this.posts = [];
                fetchdata.posts.forEach(post => {
                    this.posts.push(new Message(this.#client, post));
                });
            }else{
                this.posts = null;
            }
            if(fetchdata.replies && fetchdata.replies.replies !== null){
                this.replies = [];
                fetchdata.replies.forEach(reply => {
                    this.replies.push(new Reply(this.#client, reply));
                });
            }else{
                this.replies = null;
            }
            return this;
        }else{
            if(!this.#client.token) throw Error("Bubblez.js error: Not logged in yet");
            let params = new URLSearchParams();
            params.append('username', this.#client.user.username);
            params.append('token', this.#client.token);
            let fetchdata = await fetch(`${this.#client.apiurl}getuser`, {
                method: 'POST',
                body: params,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(r => r.json());
            if(fetchdata.error != undefined){
                throw Error(`Bubblez.js error: ${fetchdata.error}`);
            }
            this.uuid = fetchdata.uuid;
            this.username = fetchdata.username;
            this.displayname = fetchdata.displayname;
            this.pfp = fetchdata.pfp;
            this.banner = fetchdata.banner;
            this.coins = fetchdata.coins;
            this.rank = fetchdata.rank;
            this.eventr = fetchdata.eventr;
            this.patreon = fetchdata.patreon;
            this.booster = fetchdata.booster;
            this.bio = fetchdata.bio;
            this.nsfw = fetchdata.nsfw;
            this.pronoun = fetchdata.pronoun;
            this.ban = fetchdata.ban;
            this.created_at = fetchdata.created_at;
            this.last_posted = fetchdata.last_posted;
            if(fetchdata.posts && fetchdata.posts.posts !== null){
                this.posts = [];
                fetchdata.posts.forEach(post => {
                    this.posts.push(new Message(this.#client, post));
                });
            }else{
                this.posts = null;
            }
            return this;
        }
    }
}

module.exports = User;