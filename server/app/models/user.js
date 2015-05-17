var mongoose = require('mongoose');

//Event schema
var UserSchema = new mongoose.Schema({
  fbToken: String,
  privacitat: String,
  interessos: [{
    titol: String,
    interes: Boolean
  }],
  events: Array,
  baixa: Date
});

//Export model
module.exports = mongoose.model('user', UserSchema);
