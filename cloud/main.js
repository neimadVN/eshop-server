'use strict';

//add your own functions here
Parse.Cloud.define("hello", function(request, response) {
  return "world!";
});

// Products API
const Products = require('./modules/Products');
Parse.Cloud.define('getObjectByContent', Products.getObjectByContent);

// Tags API
const Tags = require('./modules/Tags');
Parse.Cloud.define('getTagList', Tags.getTagList);

// Gifts API
const Gifts = require('./modules/Gift');
Parse.Cloud.define('getGiftList', Gifts.getGiftList);

// [JOB] - migrate Data
const migrateData = require('./jobs/migrateData');
Parse.Cloud.job("migrateTags", migrateData.migrateTags);
Parse.Cloud.job("migrateProduct", migrateData.migrateProduct);