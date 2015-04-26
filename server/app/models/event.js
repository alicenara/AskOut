var mongoose = require('mongoose');

//Event schema
var EventSchema = new mongoose.Schema({
  data_inici: Date,
  data_final: Date,
  titol: String,
  descripcio: String,
  web: String,
  baixa: Date
});

//Export model
module.exports = mongoose.model('event', EventSchema);
