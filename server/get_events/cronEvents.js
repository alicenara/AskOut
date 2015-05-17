var cron = require("cron");

function doJob() {
  var getData = require('./getData');
  getData.getDataBCN();
}

var cronJob = cron.job("00 00 * * * *", function() {
        doJob();
});     
cronJob.start();
