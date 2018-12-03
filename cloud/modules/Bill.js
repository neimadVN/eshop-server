'use strict';
const _ = require('lodash');
const UTILS = require('../../helpers/UTILS');

const BillModule = {};

BillModule.getBills = function(request) {
    const user = request.user;

    const billQuery = new Parse.Query('Bill');
    billQuery.equalTo('member', user);
    billQuery.descending('createdAt');
    billQuery.include('coupon');
    billQuery.select(['objectId', 'barcode', 'discount', 'coupon.name', 'createdAt', 'total', 'totalProducts'])
    
    const queryPaging = UTILS.pageCalc(request.params.page, request.params.perPage);
    if (queryPaging) {
        billQuery.skip(queryPaging.offset);
        billQuery.limit(queryPaging.limit);
    }

    return billQuery.find().then((result) => {
        return result;
    });
};

BillModule.getBillDetail = function(request) {
    const user = request.user;

    const billQuery = new Parse.Query('Bill');
    billQuery.equalTo('member', user);
    billQuery.descending('createdAt');
    billQuery.include('coupon');
    billQuery.select(['objectId', 'barcode', 'discount', 'coupon.name', 'createdAt', 'total', 'totalProducts'])
    
    const queryPaging = UTILS.pageCalc(request.params.page, request.params.perPage);
    if (queryPaging) {
        billQuery.skip(queryPaging.offset);
        billQuery.limit(queryPaging.limit);
    }

    return billQuery.find().then((result) => {
        return result;
    });
};

module.exports = BillModule;