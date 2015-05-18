var mongoose = require('mongoose');

//Event schema
var EventSchema = new mongoose.Schema({
  _id: Number,
  data_inici: Date,
  data_final: Date,
  hora_inici: String,
  hora_final: String,
  nom: String,
  nomLloc: String,
  carrer: String,
  numero: String,
  districte: String,
  municipi: String,
  latitude: String,
  longitude: String,
  categories: Array,
  categories_generals: Array,
  users: Array,
  baixa: Date
});

//Export model
module.exports = mongoose.model('event', EventSchema);
