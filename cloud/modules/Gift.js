'use strict';
const _ = require('lodash');
const UTILS = require('../../helpers/UTILS');

const GiftsModule = {};

GiftsModule.getTagList = function (request) {
    const giftQuery = new Parse.Query('Gift');
    giftQuery.ascending('name');

    return giftQuery.find().then((result) => {
        return result;
    });
};

module.exports = GiftsModule;