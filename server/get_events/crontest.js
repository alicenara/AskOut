var cron = require("cron");


var weekday = new Array(7);
weekday[0]=  "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

function doJob() {
	/*var d = new Date();
	var fs = require('fs');
   	fs.appendFile('./test', weekday[d.getDay()] + "\n", function(err) {});

    //El codi del get open data va aqui lol
  */
  var saveData = require('./saveData');
}

var cronJob = cron.job("0 0 0 * * *", function() {
        doJob();
});     
cronJob.start();
