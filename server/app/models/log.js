var mongoose = require('mongoose');

//Event schema
var LogSchema = new mongoose.Schema({
  dia: Date,
  titol: String,
  descripcio: String
});

//Export model
module.exports = mongoose.model('log', LogSchema);
