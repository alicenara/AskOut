var mongoose = require('mongoose');
var Event = require('./event');

//Event schema
var UserSchema = new mongoose.Schema({
  fbToken: String,
  privacitat: String,
  interessos: [{
    titol: String,
    interes: Boolean
  }],
  events: [Event],
  baixa: Date
});

//Export model
module.exports = mongoose.model('user', UserSchema);
