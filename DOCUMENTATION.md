
# Bubblez.js Documentation
All functions, how to use them, and what they return is shown in this file.

## Important deprecation notice!
In update 1.1.0 bubblez.js switched from returning objects to returning classes.
The client class was named without a capital which isn't the standard for naming classes.
Make sure to use the Client (with a capital c) class instead of the now deprecated client (without a capital c) class.
The old class will still be present so everyone has time to convert their code but it will be removed in a future update.  

Also the getTokenUser method has been deprecated since the token user information is now stored in (Client).user
If you need to fetch this data from the api use (Client).user.update()  

Some values have been deprecated by the bubblez api (they default to null for the time being).
The values will still be present for now but will be removed in a future update.
The next values are deprecated:  
(User).ban  
(User).last_posted  
(Reply).deleted  
The value UUID defaults to null on canary as uuids haven't been introduced yet.

## Client (class)
### constructor
Declare client variable.
Options are optional.  
Valid options are:  
canary (true/false, standard is false): When set to true the canary api will be used.  
default (object): Default values to be used in other functions.  
  
Valid default options are:  
locked (true/false): Locks the post making no-one able to reply
from (string): Shows behind the send date on a post/reply.
```javascript
const client = new bubblez.Client({ options });
```
### Values
default: The set default options  
apiurl: The apiurl bubblez.js uses to communicate with the bubblez api  
token (1): The token bubblez.js uses to communicate with the bubblez api  
user (1): The user information of the token owner in a User class  
(1) = Only set after the login method has been run
### send
Send a post to bubblez.
Options are optional.  
Valid options are:  
locked (true/false, standard is false): If the post is locked, no-one can reply to the message.  
from (string): Shows behind the send date on a post.
```javascript
(Client).send("message here", { options });
```
Returns the Message class.
### reply
To send a reply use the below code, replace "1" with the postid and "reply here" with the reply you want to send.
Options are optional.  
Valid options are:  
from (string): Shows behind the send date on a reply.
```javascript
(Client).reply(1, "reply here", { options });
```
Returns the Reply class.
### getUser
To get info from a specific user use the below code, replace "username here" with the username you want to get information from.
```javascript
(Client).getUser("username here");
```
Returns the User class.
### getPost
Get info about a post using a postid.
```javascript
(Client).getPost(1);
```
Returns the Message class.
### getTokenUser
IMPORTANT!!! This method has been deprecated, read the important deprecation notice at the top of the documentation.  
Get information about the user bound to the token.
```javascript
(Client).getTokenUser();
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
(Client).latestPost();
```
Returns the postid as an integer.
### login
Check if your token is valid and then set the token for being used in the apirequests.
Without running this command successfully all api requests will fail due to invalid token.
This function itself does not return any data, it does emit the ready even and will send basic user data with that.
```javascript
(Client).login("token here");
```
Returns the User class.

## Message (class)
### Values
postid: The id of the post  
username: The username of the user who posted the message  
nsfw: true/false depending on whether the user is marked as an nsfw account  
content: The string of what was posted in the message  
from: Where the post was made from  
locked: true/false depending on whether the post is locked or not  
edited: Shows when the post was last edited  
post_date (1): Shows when the post was made  
replies: An array with replies which have the Reply class  
(1) = Due to api inconsistencies this data might not be available
### reply
Post a reply on this message.  
Options are optional.  
Valid options are:  
from (string): Shows behind the send date on a reply.
```javascript
(Message).reply("reply here", { options });
```
Returns the Reply class.
### delete
Delete the current message if you are the original poster.
```javascript
(Message).delete();
```
Returns true.
### update
Update the saved data of this message
```javascript
(Message).update();
```
Returns the updated Message class.

## Reply (class)
### Values
replyid: The id of the reply  
username: The username of the one who posted the reply  
content: The reply message of the reply  
from: Where the post was made from  
deleted: Whether the reply is deleted or not (deprecated, shows null)  
edited: When the reply was edited  
reply_date (1): When the reply was made  
(1) = Due to api inconsistencies this data might not be available
### delete
Delete the current reply if you are the original poster.
```javascript
(Reply).delete();
```

## User (class)
### Values
private.email (1): Email of the user  
private.dob (1): Birthdate of the user  
uuid: The uuid of this user (null on canary)  
username: The username of the user  
displayname: The displayname of the user  
pfp: The url to the pfp of the user  
banner: The url to the banner of the user  
coins: The coin amount of the user  
rank: The rank of the user  
eventr: The additional rank of the user  
patreon: true/false whether the user is a patreon or not  
booster: true/false whether the user is a booster or not  
bio: The bio of the user  
nsfw: true/false whether the user is marked as nsfw or not  
pronoun: The pronouns of the user  
ban: Shows the time when the user will be unbanned (deprecated, shows null)  
created_at: When the account was created  
last_posted: When the user last posted (deprecated, shows null)  
posts: Array of posts which have the Message class  
replies (1): The replies the user posted  
(1) = This information is only available when the information is from the token owner
### update
Update the saved data of this user
```javascript
(User).update();
```

## Errors
### Deprecation Warning: To keep class naming consistent the client class has been renamed to ...
Read the important deprecation notice at the top of the documentation.
### Deprecation Warning: Token user information is now available through <Client>.user ...
Read the important deprecation notice at the top of the documentation.
### Error: Bubblez.js error: Not logged in yet
This error appears when you try to interact with the api but you haven't logged in properly yet.
### Error: Bubblez.js error: No ... declared
This error appears when required parameters aren't set.
### Error: Bubblez.js error: Insufficient permissions to delete this message
This error appears when you try to delete a message which isn't yours.
### Error: Bubblez.js error: Insufficient permissions to delete this reply
This error appears when you try to delete a reply which isn't yours.
### Error: Bubblez.js error: (other error)
This error appears when the api returns an error.  
These responses are made by the bubblez api and not the bubblez.js module.
### TypeError: Bubblez.js: "(variable name)" variable is (variable type), expected (expected variable type)
This error appears when you declare parameters with incorrect types.