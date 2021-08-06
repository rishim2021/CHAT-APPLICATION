const mongoose = require('mongoose');

const { Schema } = mongoose;

const chatSchema = new Schema({
    chat: {
        type:String
    }
});


module.exports = { Chat : mongoose.model('Chat',chatSchema) };
