'use strict';
const _ = require('lodash');
const UTILS = require('../../helpers/UTILS');

const BillModule = {};

BillModule.getBills = function (request) {
    const user = request.user;

    const billQuery = new Parse.Query('Bill');
    billQuery.equalTo('member', user);
    billQuery.descending('createdAt');
    billQuery.include('coupon');
    billQuery.select(['objectId', 'barcode', 'discount', 'coupon.name', 'createdAt', 'total', 'totalProducts']);

    const queryPaging = UTILS.pageCalc(request.params.page, request.params.perPage);
    if (queryPaging) {
        billQuery.skip(queryPaging.offset);
        billQuery.limit(queryPaging.limit);
    }

    return billQuery.find().then((result) => {
        return UTILS.parseObjectArray2JSON(result);
    });
};

BillModule.getBillDetail = function (request) {
    let promises = [];
    const user = request.user;
    const billObjectId = request.params.billObjectId;

    const billQuery = new Parse.Query('Bill');
    billQuery.equalTo('objectId', billObjectId);
    billQuery.include(['coupon', 'employee']);
    promises.push(billQuery.first());

    const billPointer = UTILS.createBlankPointerTo('Bill', billObjectId);
    const billDetailQuery = new Parse.Query('BillDetail');
    billDetailQuery.equalTo('bill', billPointer);
    billDetailQuery.ascending('updatedAt');
    billDetailQuery.include(['product', 'product.gift']);
    billDetailQuery.select(['unitPrice', 'product.barcode', 'product.price', 'product.name', 'product.gift.name', 'isGiftIncluded', 'amount'])
    promises.push(billDetailQuery.find());

    return Promise.all(promises).then((result) => {
        return UTILS.parseObjectArray2JSON(result);;
    });
};

module.exports = BillModule;