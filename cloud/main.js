'use strict';

//add your own functions here
Parse.Cloud.define("hello", function(request, response) {
  return "world!";
});


// [JOB] - migrate Data
const migrateData = require('./jobs/migrateData');
Parse.Cloud.job("migrateTags", migrateData.migrateTags);
Parse.Cloud.job("migrateProduct", migrateData.migrateProduct);