'use strict';

//add your own functions here
Parse.Cloud.define("hello", function(request, response) {
  return "world!";
});

// Products API
const Products = require('./modules/Products');
Parse.Cloud.define('getObjectByContent', Products.getObjectByContent);
Parse.Cloud.define('getProductList', Products.getProductList);
Parse.Cloud.define('getProductDetail', Products.getProductDetail);
Parse.Cloud.define('searchProduct', Products.searchProduct);

// Tags API
const Tags = require('./modules/Tags');
Parse.Cloud.define('getTagsList', Tags.getTagsList);

// Gifts API
const Gifts = require('./modules/Gift');
Parse.Cloud.define('getGiftList', Gifts.getGiftList);

// Bill API
const Bills = require('./modules/Bill');
Parse.Cloud.define('getBills', Bills.getBills);

// [JOB] - migrate Data
const migrateData = require('./jobs/migrateData');
Parse.Cloud.job("migrateTags", migrateData.migrateTags);
Parse.Cloud.job("migrateProduct", migrateData.migrateProduct);