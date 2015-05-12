var cron = require("cron");

function doJob() {
  var getData = require('./getData');
  getData.getDataBCN();
}

var cronJob = cron.job("* * * * * *", function() {
        doJob();
});     
cronJob.start();
