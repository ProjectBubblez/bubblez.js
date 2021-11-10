module.exports = {
    Client: require('./client/index.js'),

    // Classes
    Message: require('./classes/Message.js'),
    Reply: require('./classes/Reply.js'),
    User: require('./classes/User'),
    Version: require('./package.json').version
};