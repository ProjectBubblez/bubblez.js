
# Bubblez.js Documentation
All functions, how to use them, and what they return is shown in this file.
The bubblez.js module require nodejs version 14 or above.

## Canary UUIDs
The value UUID defaults to null on canary as uuids haven't been introduced yet on canary.

## Client (class)
### constructor
Declare client variable.
Options are optional.  
Valid options are:  
canary (true/false, standard is false): When set to true the canary api and websocket will be used.  
default (object): Default values to be used in other functions.  
verbose (true/false, standard is false): Show extra output, can be useful for debugging  
websocketurl (string): Overwrite the url Bubblez.js should use to contact the websocket  
apiurl (string): Overwrite the url Bubblez.js should use to contact the api  
disableWebsocket (true/false): Disable websocket functionality  
showOffline (true/false): Skips updating online status when set as true
  
Valid default options are:  
locked (true/false): Locks the post making no-one able to reply  
from (string): Shows behind the send date on a post/reply.  
nsfw (true/false): Set's all posts and replies to NSFW.
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
nsfw (true/false, standard is false): sets the post status to NSFW meaning none under the age of 18 can see the post.
```javascript
(Client).send("message here", { options });
```
Returns the Message class.
### reply
To send a reply use the below code, replace "1" with the postid and "reply here" with the reply you want to send.
Options are optional.  
Valid options are:  
from (string): Shows behind the send date on a reply.  
nsfw (true/false, standard is false): sets the reply status to NSFW meaning none under the age of 18 can see the reply.
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
### latestBlog
Get the info about the latest blogpost/devlog.
```javascript
(Client).latestBlog();
```
Return example:
```json
{
  "blogid": "1",
  "blogposter_username": "embed",
  "blogposter_displayname": "embed",
  "blogposter_pfp": "https://i.imgur.com/Md5C3uy.gif",
  "blogcontent": "Welcome to Canary! This is where we will be testing new features for Bubblez! If you find any bugs, please report them to us on our Discord!\r\n" +
    "\r\n" +
    "https://discord.gg/7cCV5Y9",
  "blogdate": "2020-05-26 11:49:23"
}
```
### getTokenUser
IMPORTANT!!! This method has been removed, read the important remove note at the top of the documentation.  
### latestPost
Returns the postid of the newest post.
```javascript
(Client).latestPost();
```
Returns the postid as an integer.
### lockPost
Locks/unlocks a post.
In the first position you define the postid and in the second one you define whether you want the post to be locked or unlocked.  
true: Lock the post  
false: Unlock the post
```javascript
(Client).lockPost(1, true);
```
Returns true.
### editPost
Edit the message in a post.
In the first position you define the postid and in the second one you define what you want to edit the message to.
```javascript
(Client).editPost(1, "Bubblez.js is quite good");
```
Returns true.
### editReply
Edit the message in a reply.
In the first position you define the replyid and in the second one you define what you want to edit the message to.
```javascript
(Client).editReply(1, "I can definitely agree with that");
```
Returns true.
### login
Check if your token is valid and then set the token for being used in the apirequests.
Without running this command successfully all api requests will fail due to invalid token.
This function itself does not return any data, it does emit the ready even and will send basic user data with that.
```javascript
(Client).login("token here");
```
Returns the User class.

## Client (events)
The Client class has a few events which are documented here.
### ready
This event is emitted when the login function has determined you are fully authorized.  
A variable is attached to this event that has the client user information in a User class.
```javascript
(Client).on("ready", (user) => {
  console.log(user);
});
```
### post
This event is emitted when a new post is made.  
Being connected to the websocket is necessary for this event to be emitted.  
A variable is attached to this event that has the information of the new post in a Message class.
```javascript
(Client).on("post", (post) => {
  console.log(post);
});
```
### reply
This event is emitted when a new reply is made.  
Being connected to the websocket is necessary for this event to be emitted.  
Two variables are attached to this event that have the information of the new reply in a Reply class and the parent message in a Message class.
```javascript
(Client).on("reply", (reply, post) => {
  console.log(reply);
  console.log(post);
});
```

## Message (class)
### Values
postid: The id of the post  
username: The username of the user who posted the message  
content: The string of what was posted in the message  
from: Where the post was made from  
locked: true/false depending on whether the post is locked or not  
pnsfw: true/false depending on whether the post is marked as NSFW
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
### toggleLock
Locks the post if it's unlocked, unlocks the post if it's locked.
```javascript
(Message).toggleLock();
```
Returns true.
### edit
Edit the message in a post.
Only argument is the string the post needs to be edited to.
```javascript
(Message).edit("Bubblez.js is quite good");
```
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
rnsfw: true/false depending on whether the reply is marked as NSFW
edited: When the reply was edited  
reply_date (1): When the reply was made  
(1) = Due to api inconsistencies this data might not be available
### delete
Delete the current reply if you are the original poster.
```javascript
(Reply).delete();
```
### edit
Edit the message in a reply.
Only argument is the string the reply needs to be edited to.
```javascript
(Reply).edit("I can definitely agree with that");
```

## User (class)
### Values
private.email (1): Email of the user  
private.dob (1): Birthdate of the user  
uuid: The uuid of this user (null on canary)  
username: The username of the user  
displayname: The displayname of the user  
followers: The follower amount of the user  
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
created_at: When the account was created  
posts: Array of posts which have the Message class  
replies (1): The replies the user posted  
(1) = This information is only available when the information is from the token owner
### update
Update the saved data of this user
```javascript
(User).update();
```

## Errors
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
