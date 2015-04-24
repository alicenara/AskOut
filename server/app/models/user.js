var mongoose = require('mongoose');

//Event schema
var UserSchema = new mongoose.Schema({
  fbToken: Date,
  privacitat: String,
  baixa: Date
});

//Export model
module.exports = mongoose.model('user', UserSchema);
