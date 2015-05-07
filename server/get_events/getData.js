/*L'Alvaro ha fet això i mola molt */

module.exports = {
	getDataBCN: function () {
		getOpenDataBCN();
	}
};

function getOpenDataBCN() {
	var http = require("http");
	var fs = require("fs");
	// Encoding
	var iconv = require('iconv-lite');
  iconv.extendNodeEncodings();
	
	// substituir el "http..." per web quan estigui acabat
	var req = http.get("http://w10.bcn.es/APPS/asiasiacache/peticioXmlAsia?id=199", function(res) {
		console.log('Obtaining data. Status: ' + res.statusCode);
		var bufList = [];
    res.setEncoding('ISO-8859-1');
		res.on('data', function (chunk) {
			var buf = new Buffer(chunk);
			bufList.push(buf);
		});
		res.on('end', function () {
			callbackData(bufList);
		});
	});
}

function callbackData(bufList) {
	var result = Buffer.concat(bufList);
	var xml = result.toString();

	var json;
	var parseString = require('xml2js').parseString;
	parseString(xml, function (err, result) {
		json = result;
		var jsObj = transformData(json);
    var saveData = require('./saveData');
    saveData(jsObj, function(result){
      console.log(result);
    });		
	});
}

function transformData(json) {
	var obj = json.response.body[0].resultat[0].actes[0].acte;
	var eventArray = [];
	for (var i in obj) {
		var aux = new Object();

		aux.id = obj[i].id[0];
		aux.nom = obj[i].nom[0];
		aux.nomLloc = obj[i].lloc_simple[0].nom[0];
		aux.carrer = obj[i].lloc_simple[0].adreca_simple[0].carrer[0]._;
		aux.numero = obj[i].lloc_simple[0].adreca_simple[0].numero[0]._;
		aux.districte = obj[i].lloc_simple[0].adreca_simple[0].districte[0]._;
		aux.municipi = obj[i].lloc_simple[0].adreca_simple[0].municipi[0]._;
		aux.lat = obj[i].lloc_simple[0].adreca_simple[0].coordenades[0].googleMaps[0].$.lat;
		aux.lon = obj[i].lloc_simple[0].adreca_simple[0].coordenades[0].googleMaps[0].$.lon;
		aux.dataIni = obj[i].data[0].data_proper_acte[0];
		aux.dataFi = obj[i].data[0].hora_fi[0];
		var foobar = obj[i].classificacions[0].nivell;
		aux.clasificacions = [];
		for (var j in foobar) {
			aux.clasificacions.push(foobar[j]._);
		}
		eventArray.push(aux);
	}
	return eventArray;
}

