const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

class client{
    constructor(token, options){
        if(!token){
            throw Error("Bubblez.js error: No token received");
        }
        this.token = token;
        if(options != undefined){
            if(options.canary == true){
                this.apiurl = 'https://canary.bubblez.app/api/';
            }else{
                this.apiurl = 'https://bubblez.app/api/';
            }
        }else{
            this.apiurl = 'https://bubblez.app/api/';
        }
    }

    send(message, options){
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
            throw Error("Bubblez.js error: No message declared")
        }else{
            params.append('post', message);
        }
        params.append('token', this.token);
        fetch(`${this.apiurl}sendpost`, {
            method: 'POST',
            body: params,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }
}

module.exports = client;