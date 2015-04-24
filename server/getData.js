module.exports = {
	getDataBCN: function () {
		/*
		var http = require("http");
		var req = http.get("http://w10.bcn.es/APPS/asiasiacache/peticioXmlAsia?id=199", function(res) {
			console.log("Obtaining data. Status: " + res.statusCode);
			var bufList = [];
			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				var buf = new Buffer(chunk);
				bufList.push(buf);
				var xml = buf.toString();
				console.log(xml);
			});
		});
		return true;
		*/
		getOpenData();
		/*var fs = require("fs");
		fs.readFile('example.xml', function(err, data) {
			if (err) console.log(err);

			var buf = data;
			buf = buf.toString();
			var textJson = '{';
			buf = prepareData(buf);
			console.log(buf);
			xmlconv(buf, textJson);

			fs.writeFile('pene.json', textJson, function(err) {
				if (err) console.log(err);
			});
		});*/
	},
	bar: function (xml) {
		return xml2json(xml);
	}
};

function getOpenData() {
	var http = require("http");
	//var fs = require("fs");
    var url = "http://w10.bcn.es/APPS/asiasiacache/peticioXmlAsia?id=199";
	// Encoding
	var Iconv  = require('iconv').Iconv;
	var iconv = new Iconv('ISO-8859-1', 'UTF-8');

	// Don't use get. Instead try with request for the encoding purposes.
	var req = http.get(url, function(res) {
		console.log("Obtaining data. Status: " + res.statusCode);
		/*var bufList = [];
		res.pipe(iconv).pipe(res);
		res.setEncoding('utf8');*/
        var xml = "";
		res.on('data', function (chunk) {
            xml += chunk;
			/*var buf = new Buffer(chunk);
			bufList.push(buf);*/
		});
		res.on('end', function () {
			//callbackData(bufList);
            //callbackData(xml);
            console.log(xml);
		});
	})/*.pipe(iconv).pipe(fs.createWriteStream("pene.xml"))*/;
	return true;
}

/*
function callbackData(bufList) {
	var result = Buffer.concat(bufList);

	var Iconv  = require('iconv').Iconv;
	var iconv = new Iconv('ISO-8859-1', 'UTF-8');
	result = iconv.convert(result);

	var xml = result.toString();
	//console.log(xml);

	//var jsonObj = xml2json(result);
}
*/
/*
function xml2json(xml) {
	var stack = [];
	var i = 0;
	var jsonData = "{";
	var lastInTag, 
		coma = false;

	while (i < xml.length) {
		if (xml[i] == '/' && xml[i+1] == '>') {
			stack.pop();
			jsonData = jsonData.concat('null');
		}
		if (xml[i] == '<' && xml[i+1] == '/') {
			var popName = stack.pop();
			if (lastInTag == popName) {
				coma = true;
			}
			else {
				coma = false;
				jsonData = jsonData.concat('}]');				
			}
			i++;
		}
		if (xml[i] == '<') {
			var nameTag = [];
			while (xml[i] != '>' || xml[i] != ' ') {
				nameTag.push(xml[i]);
				i++;
			}
			nameTag = nameTag.join("");

			stack.push(nameTag);
			lastInTag = nameTag;
			if (coma) jsonData = jsonData.concat(',');
			if (xml[i] == '>') {
				jsonData = jsonData.concat('"' + nameTag + '":');
			}
			if (abc(xml[i+1])) {
				var text = [];
				i++;
				while (xml[i] != '<') {
					text.push(xml[i]);
					i++;
				}
				text = text.join("");
				jsonData = jsonData.concat('"' + text + '"');
			} else {

			}
		}
		i++;
	}
	jsonData = jsonData.concat("}");

	var obj;
	try {
		obj = JSON.parse(text);
	} catch(err) {
		console.log(err);
	}
	return obj;
}

tag 
*/

function xmlconv(data, jsonObj) {
	i = 0;

	while (i < data.length) {
		var tag = getTags(data);
		i = tag.i;
		
		var newData = data.substring(tag.dataBegin, tag.dataEnd);
		if (tag.tagDescription == "") jsonObj = jsonObj.concat('"' + tag.tagDescription + '"');
		else {
			jsonObj = jsonObj.concat('"' + tag.tagName + '":');
			if (openList) jsonObj = jsonObj.concat('[');
			if (openKey) jsonObj = jsonObj.concat('{');
			// Recursion
			console.log(jsonObj);
			jsonObj = xmlconv(newData, jsonObj);
		}

		if (i < data.length) jsonObj = jsonObj.concat(',');
		else {
			jsonObj = jsonObj.concat('}');
			if (openList) jsonObj = jsonObj.concat(']');
		}
	}
}

function getTags(data) {
	var tag = {
		tagName: "",
		tagDescription: "",
		dataBegin: null,
		dataEnd: null,
		openKey: false,
		openList: false,
		i: null
	}
	var j = 0;

	while (j < data.length && !tag.openList) {
		console.log(data[j]);
		console.log(j);
		if (data[j] == '<') {
			var aux = [];
			while (data[j] != ' ' || data[j] != '>') {
				aux.push(data[j]);
				j++;
			}
			if (data[j] == ' ') {
				while (data[j] != '>') j++;
				if (data[j-1] != '/') {
					aux = aux.join("");
					console.log(aux);
					if (tag.tagName == "") tag.tagName = aux;
					else if (tag.tagName == aux) tag.openList = true;
					j++;
					tag.dataBegin = j;
					console.log('Data begin = ' + j);
					var n1 = data.indexOf('<', j);

					// Search the closing tag
					var strToSearch = '<';
					strToSearch = strToSearch.concat(aux);
					strToSearch = strToSearch.concat('/>');

					var n2 = data.indexOf(strToSearch);
					if (n2 > 0) {
						tag.dataEnd = n2;
						console.log(n2);
						j = n2 + strToSearch.length - 1;
					}
					if (n1 >= tag.dataBegin && n1 < n2) tag.openKey = true;
				}
			}
		}
		j++;
	}

	if (tag.tagName == "") tag.tagDescription = data;
	tag.i = j;
	return tag;
}

function prepareData(data) {
	var l = data.indexOf('?>') + 2;
	return data.substring(l);
}

