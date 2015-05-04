/* 
	No he pogut deixar-t'ho millor perque la web de OpenData de BCN
	devia estar reiniciant els servers a les 2 i pico i no em deixava
	pillar les dades dels xml :S
	SORRY! :(
	Dema ho acabem en un plis. Crec que no queda masa.
*/


module.exports = {
	getDataBCN: function () {
		return getOpenDataBCN();
	}
};

function getOpenDataBCN(web) {
	var http = require("http");
	var fs = require("fs");
	// Encoding
	var Iconv  = require('iconv').Iconv;
	var iconv = new Iconv('ISO-8859-1', 'UTF-8');
	
	var jsObj;

	// substituir el "http..." per web quan estigui acabat
	var req = http.get("http://w10.bcn.es/APPS/asiasiacache/peticioXmlAsia?id=199", function(res) {
		console.log('Obtaining data. Status: ' + res.statusCode);
		var bufList = [];
		res.on('data', function (chunk) {
			var buf = new Buffer(chunk);
			bufList.push(buf);
		});
		res.on('end', function () {
			return ( callbackData(bufList) );
		});
	}).pipe(iconv).end();

	return jsObj;
}

function callbackData(bufList) {
	var result = Buffer.concat(bufList);
	var xml = result.toString();

	var json;
	var parseString = require('xml2js').parseString;
	parseString(xml, function (err, result) {
		json = result;
	});

	return json.response.body[0].resultat[0].actes[0].acte;
}

