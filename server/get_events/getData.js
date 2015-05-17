module.exports = {
	getDataBCN: function() {
		var webs = [//"http://w10.bcn.es/APPS/asiasiacache/peticioXmlAsia?id=199",
			"http://w10.bcn.es/APPS/asiasiacache/peticioXmlAsia?id=103",
			"http://w10.bcn.es/APPS/asiasiacache/peticioXmlAsia?id=104",
			"http://w10.bcn.es/APPS/asiasiacache/peticioXmlAsia?id=105",
			"http://w10.bcn.es/APPS/asiasiacache/peticioXmlAsia?id=106",
		];
		for (var k in webs) {
			getOpenDataBCN(webs[k]);
		}
	}
};

var finalData = [];

function getOpenDataBCN(web) {
	var http = require("http");
	var fs = require("fs");
	// Encoding
	var iconv = require('iconv-lite');
	iconv.extendNodeEncodings();

	var req = http.get(web, function(res) {
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
		finalData.push(jsObj);
		if(finalData.length == 4){
			var saveData = require('./saveData');
			saveData(finalData, function(result){
				console.log(result);
  		});	
		}	
	});
}

function transformData(json) {
	var obj = json.response.body[0].resultat[0].actes[0].acte;
	var eventArray = [];
	for (var i in obj) {
		var aux = new Object();

		aux._id = obj[i].id[0];
		aux.nom = obj[i].nom[0];
		aux.nomLloc = obj[i].lloc_simple[0].nom[0];
		aux.carrer = obj[i].lloc_simple[0].adreca_simple[0].carrer[0]._;
		aux.numero = obj[i].lloc_simple[0].adreca_simple[0].numero[0]._;
		aux.districte = obj[i].lloc_simple[0].adreca_simple[0].districte[0]._;
		aux.municipi = obj[i].lloc_simple[0].adreca_simple[0].municipi[0]._;
		if (obj[i].hasOwnProperty('googleMaps')) {
			aux.lat = obj[i].lloc_simple[0].adreca_simple[0].coordenades[0].googleMaps[0].$.lat;
			aux.lon = obj[i].lloc_simple[0].adreca_simple[0].coordenades[0].googleMaps[0].$.lon;
		}	
		aux.dataIni = obj[i].data[0].data_proper_acte[0];
		/*if (obj[i].hasOwnProperty('hora_fi')) {
			aux.dataFi = obj[i].data[0].hora_fi[0];
		} else if (obj[i].hasOwnProperty('data_fi')) {
			*/aux.dataFi = obj[i].data[0].data_fi[0];
		//}
		var foobar = obj[i].classificacions[0].nivell;
		aux.clasificacions = [];
		aux.categories_generals = [];
		for (var j in foobar) {
			var newClasificacio = modificaClasificacio(foobar[j]._);
			aux.clasificacions.push(foobar[j]._);
			if (!includeObj(aux.categories_generals, newClasificacio)) aux.categories_generals.push(newClasificacio);
		}
		eventArray.push(aux);
	}
	return eventArray;
}

function modificaClasificacio(clasi) {
	var result = "";
	var map = require('./mapClasifications.js');
	if (map.mapClasi[clasi] == null || map.mapClasi[clasi] == undefined){
		return "Oci&Cultura";
	}else 
		return map.mapClasi[clasi];
}

function includeObj(arr, obj) {
    return (arr.indexOf(obj) != -1);
}

