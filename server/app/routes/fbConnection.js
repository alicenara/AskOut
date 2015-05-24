module.exports = function(options,options2,onResult) {
  var https = require("https");
  var req = https.request(options,function(res){

    
    var output = "";
    res.setEncoding('utf8');
    res.on('data',function(chunk){
      output+=chunk;
    });

    res.on('end', function(){
      var obj = JSON.parse(output);
      //onResult(obj.id);
      if(obj.id == 355198514515820){
        var req2 = https.request(options2,function(res2){
          var output2 = "";
          res2.setEncoding('utf8');
          res2.on('data',function(chunk){
            output2+=chunk;
          });
          res2.on('end', function(){
            var obj2 = JSON.parse(output2);
            onResult(obj2.id);
          });
        });
        req2.on('error',function(err){
          onResult("error2: "+ err);
        });

        req2.end();
      }else{
        onResult("fals");
      }
    });
  });

  req.on('error',function(err){
    onResult("error: "+ err);
  });

  req.end();
}