'use strict';
const _ = require('lodash');
const UTILS = require('../../helpers/UTILS');

const ProductsModule = {};

ProductsModule.getObjectByContent = function (request) {
    console.log(request.params);
    const keyword = new RegExp(request.params.keyword, 'i');
    console.log(keyword);
    if (!request.params.keyword || !keyword) {
        return null;
    }

    const productBarcode = new Parse.Query('Product').matches('barcode', keyword);
    const productName = new Parse.Query('Product').matches('name', keyword);

    const memberBarcode = new Parse.Query('User').matches('barcode', keyword);
    const memberUsername = new Parse.Query('User').matches('username', keyword);
    const memberFullname = new Parse.Query('User').matches('fullName', keyword);
    const memberPhone = new Parse.Query('User').matches('phoneNumber', keyword);

    const couponBarcode = new Parse.Query('Coupon').matches('barcode', keyword);
    const couponName = new Parse.Query('Coupon').matches('name', keyword);

    const giftBarcode = new Parse.Query('Gift').matches('barcode', keyword);
    const giftName = new Parse.Query('Gift').matches('name', keyword);

    const productQuery = Parse.Query.or(
        productBarcode,
        productName
    );
    productQuery.select(['barcode', 'name']);
    productQuery.limit(10);

    const memberQuery = Parse.Query.or(
        memberBarcode,
        memberUsername,
        memberFullname,
        memberPhone
    );
    memberQuery.select(['barcode', 'username', 'fullName', 'phoneNumber']);
    memberQuery.limit(10);

    const couponQuery = Parse.Query.or(
        couponBarcode,
        couponName
    );
    couponQuery.select(['barcode', 'name']);
    couponQuery.limit(10);

    const giftQuery = Parse.Query.or(
        giftBarcode,
        giftName
    );
    giftQuery.select(['barcode', 'name']);
    giftQuery.limit(10);

    const promises = [];
    promises.push(productQuery.find());
    promises.push(memberQuery.find());
    promises.push(couponQuery.find());
    promises.push(giftQuery.find());

    return Promise.all(promises).then((result) => {
        console.log(result);
        return [...result[0], ...result[1], ...result[2], ...result[3]];
    });
};

ProductsModule.getProductList = function (request) {
    let offset = !_.isUndefined(request.params.start) ? parseInt(request.params.start) : 0;
    let limit = !_.isUndefined(request.params.length) ? parseInt(request.params.length) : 10;
    let sortField = 'createdAt';
    let direction = 'desc';
    if (offset) {
        queryEvent.skip(offset);
    }
    if (limit) {
        queryEvent.limit(limit);
    }
    if (direction == 'desc') {
        queryEvent.descending(sortField);
    } else {
        queryEvent.ascending(sortField);
    }

    let promises = [];
    promises.push(queryCountEvent.count({ useMasterKey: true }));
    promises.push(queryEvent.find({ useMasterKey: true }));
}

module.exports = ProductsModule;