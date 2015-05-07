var mongoose = require('mongoose');
var Event = require('./event');

//Event schema
var UserSchema = new mongoose.Schema({
  fbToken: Date,
  privacitat: String,
  events: [Event],
  baixa: Date
});

//Export model
module.exports = mongoose.model('user', UserSchema);
