'use strict';
const _ = require('lodash');
const UTILS = require('../../helpers/UTILS');

const ProductsModule = {};

ProductsModule.getObjectByContent = function (request) {
    const keyword = new RegExp(request.params.keyword, 'i');
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
    productQuery.select(['barcode', 'name', 'price']);
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
        return UTILS.parseObjectArray2JSON([...result[0], ...result[1], ...result[2], ...result[3]]);
    });
};

ProductsModule.getProductList = function (request) {
    const productQuery = new Parse.Query('Product');
    const isNewProduct = request.params.isNewProduct || false;
    const queryPaging = UTILS.pageCalc(request.params.page, request.params.perPage);
    if (queryPaging) {
        productQuery.skip(queryPaging.offset);
        productQuery.limit(queryPaging.limit);
    }
    if (isNewProduct) {
        productQuery.ascending('createdAt');
    } else {
        productQuery.ascending('objectId');
    }

    productQuery.include('tag');
    productQuery.include('gift');

    const tagObjectId = request.params.tagObjectId ? request.params.tagObjectId : undefined;
    const tagKeyword = request.params.tagKeyword ? request.params.tagKeyword : undefined;

    let subQuery = null;
    if (tagObjectId) {
        const tagQueryId = UTILS.buildPointerQuery('Tag', ['name', 'objectId']);
        tagQueryId.equalTo('objectId', tagObjectId);
        subQuery = subQuery ? Parse.Query.or(subQuery, tagQueryId) : tagQueryId;
    }

    if (tagKeyword) {
        const tagQueryKeywordName = UTILS.buildPointerQuery('Tag', ['name', 'objectId']);
        tagQueryKeywordName.contains('name',tagKeyword);

        const tagQueryKeywordBarbode = UTILS.buildPointerQuery('Tag', ['name', 'objectId']);
        tagQueryKeywordBarbode.equalTo('barcode',tagKeyword);

        const tagQueryKeyword = Parse.Query.or(tagQueryKeywordName, tagQueryKeywordBarbode);
        subQuery = subQuery ? Parse.Query.or(subQuery, tagQueryKeyword) : tagQueryKeyword;
    }

    if (subQuery) {
        productQuery.matchesQuery('tag', subQuery);
    }
    
    return productQuery.find().then((result) => {
        return UTILS.parseObjectArray2JSON(result);
    });
    
};

ProductsModule.getProductDetail = function (request) {
    const productQuery = new Parse.Query('Product');
    productQuery.equalTo('objectId', request.params.objectId);
    productQuery.include('tag');
    productQuery.include('gift');

    return productQuery.first().then((result) => {
        return result.toJSON();
    });
};

ProductsModule.searchProduct = function (request) {
    const keyword = _.toUpper(request.params.keyword);
    const productQueryName = new Parse.Query('Product');
    productQueryName.contains('name', keyword);
    
    const productQueryBarcode = new Parse.Query('Product');
    productQueryBarcode.contains('barcode', keyword);

    const productQuery = Parse.Query.or(productQueryName, productQueryBarcode);
    productQuery.select(['objectId', 'name', 'barcode']);
    productQuery.equalTo('STATUS', 'active');

    const queryPaging = UTILS.pageCalc(request.params.page, request.params.perPage);
    if (queryPaging) {
        productQuery.skip(queryPaging.offset);
        productQuery.limit(queryPaging.limit);
    }

    return productQuery.find().then((result) => {
        return UTILS.parseObjectArray2JSON(result);
    });
};

module.exports = ProductsModule;