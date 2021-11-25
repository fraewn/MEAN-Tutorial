const ReportController = require("../controllers/reports");

exports.cleanReportCronJob = () => {
  let CronJob = require('cron').CronJob;
  let job = new CronJob('*/5 * * * * *', function() {
    ReportController.deleteReportBatch();
  }, null, true, 'America/Los_Angeles');
  job.start();
}
