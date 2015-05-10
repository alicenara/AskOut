var mongoose = require('mongoose');

//Event schema
var EventSchema = new mongoose.Schema({
  _id: Number,
  data_inici: Date,
  data_final: Date,
  nom: String,
  nomLloc: String,
  carrer: String,
  numero: String,
  districte: String,
  municipi: String,
  latitude: String,
  longitude: String,
  categories: Array,
  categoria_general: String,
  baixa: Date
});

//Export model
module.exports = mongoose.model('event', EventSchema);
