const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

class Reply{
    #client;

    constructor(client, data){
        this.#client = client;
        this.replyid = data.replyid;
        this.username = data.username;
        this.content = data.content;
        this.from = data.from;
        if(data.edit_date !== undefined) this.edited = data.edit_date;
        if(data.edited !== undefined) this.edited = data.edited;
        if(data.reply_date) this.reply_date = data.reply_date;
    }

    async delete(){
        if(this.#client.user.username == this.username){
            if(!this.#client.token) throw Error("Bubblez.js error: Not logged in yet");
            let params = new URLSearchParams();
            params.append('replyid', this.replyid);
            params.append('token', this.#client.token);
            params.append('confirm', true);
            if(this.#client.verbose == true) console.log(`[Bubblez.js] Sending api request to ${this.#client.apiurl}reply/delete`);
            let fetchdata = await fetch(`${this.#client.apiurl}reply/delete`, {
                method: 'POST',
                body: params,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).then(r => r.json());
            if(fetchdata.error != undefined){
                throw Error(`Bubblez.js error: ${fetchdata.error}`);
            }
            return true;
        }else{
            throw Error(`Bubblez.js error: Insufficient permissions to delete this reply`);
        }
    }
}

module.exports = Reply;