
# Bubblez.js Documentation
All functions, how to use them, and what they return is shown in this file.
## client
### constructor
Declare client variable.
Options is optional.  
Valid options are:  
canary (true/false, standard is false): When set to true the canary api will be used.
```javascript
const client = new bubblez.client({ options });
```
### send
Send a post to bubblez.
Options is optional.  
Valid options are:  
locked (true/false, standard is false): If the post is locked, no-one can reply to the message.  
from (string): Shows behind the send date on a post.
```javascript
client.send("message here", { options });
```
Return example:
```json
{
  "200": "message sent",
  "post": "Test",
  "from": null,
  "locked": "false",
  "postid": 444
}
```
### reply
To send a reply use the below code, replace "1" with the postid and "reply here" with the reply you want to send.
Options is optional.  
Valid options are:  
from (string): Shows behind the send date on a post.
```javascript
client.reply(1, "reply here", { options });
```
Return example:
```json
{
  "200": "reply sent",
  "reply": "Test",
  "postid": "444",
  "from": null
}
```
### getUser
To get info from a specific user use the below code, replace "username here" with the username you want to get information from.
```javascript
client.getUser("username here");
```
Return example:
```json
{
  "200": "Found user",
  "username": "Slice",
  "displayname": "Slice",
  "pfp": "https://i.imgur.com/rlN6cZN.jpg",
  "banner": null,
  "coins": "5",
  "rank": "bughunter",
  "eventr": null,
  "patreon": "false",
  "booster": "false",
  "bio": "Hello, i like cheese.",
  "nsfw": "false",
  "ban": null,
  "created_at": "2020-05-26 11:43:49",
  "last_posted": "2021-03-17 19:23:41"
}
```
### getPost
Get info about a post using a postid.
```javascript
client.getPost(1);
```
Return example:
```json
{
  "200": "Found post",
  "postid": "437",
  "username": "Slice",
  "nsfw": "false",
  "content": "@Slice echo Hmm, a bot with commands inside of bubblez?",
  "from": null,
  "locked": "false",
  "edited": null,
  "post_date": "2021-03-17 19:11:31",
  "replies": { "error": "No replies found" }
}
```
### getTokenUser
Get information about the user bound to the token.
```javascript
client.getTokenUser();
```
Return example:
```json
{
  "200": "Found user",
  "username": "Slice",
  "displayname": "Slice",
  "email": "censored",
  "pfp": "https://i.imgur.com/rlN6cZN.jpg",
  "banner": null,
  "coins": "5",
  "rank": "bughunter",
  "eventr": null,
  "patreon": "false",
  "booster": "false",
  "bio": "Hello, i like cheese.",
  "nsfw": "false",
  "dob": "censored",
  "ban": null,
  "created_at": "2020-05-26 11:43:49",
  "last_posted": "2021-03-17 19:23:41",
  "posts": [
    {
      "postid": "201",
      "username": "Slice",
      "nsfw": "false",
      "content": "Hi canary",
      "from": null,
      "locked": "false",
      "edited": null,
      "post_date": "2020-05-26 11:54:27"
    }
  ],
  "replies": [
    {
      "postid": "220",
      "username": "Slice",
      "nsfw": "false",
      "content": "Hi @darkmatter",
      "from": null,
      "edited": null,
      "reply_date": "2020-05-29 19:16:58"
    }
  ]
}
```
### latestPost
Returns the postid of the newest post.
```javascript
client.latestPost();
```
Return example:
```json
{
    "200": "latest Post",
    "postid": "446"
}
```
### login
Check if your token is valid and then set the token for being used in the apirequests.
Without running this command successfully all api requests will fail due to invalid token.
This function itself does not return any data, it does emit the ready even and will send basic user data with that.
```javascript
client.login("token here");
```
Example emit return data:
```json
{
  "200": "Found Token",
  "username": "Slice",
  "receivedtoken": "censored",
  "senttoken": "censored"
}
```