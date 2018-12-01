'use strict';

//add your own functions here
Parse.Cloud.define("hello", function(request, response) {
  return "world!";
});

// Products API
const Products = require('./modules/Products');
Parse.Cloud.define('getObjectByContent', Products.getObjectByContent);


// [JOB] - migrate Data
const migrateData = require('./jobs/migrateData');
Parse.Cloud.job("migrateTags", migrateData.migrateTags);
Parse.Cloud.job("migrateProduct", migrateData.migrateProduct);