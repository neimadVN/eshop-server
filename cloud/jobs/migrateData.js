'use strict';
const _ = require('lodash');

const migrateData = {};
const UTILS = require('../../helpers/UTILS');

migrateData.migrateTags = function (request) {
    const TagsData = require('./data/Tags.json').Tags;

    if (!_.isArray(TagsData)) {
        console.log('[!] - >>>>> ERROR <<<<< - [!]\nData Error');
        return false;
    }

    let promises = [];
    TagsData.forEach((tag) => {
        let Query = new Parse.Query('Tag');
        Query.equalTo('name', tag.name);

        const tagPromise = new Promise((resolve) => {
            Query.first().then(async (result) => {
                let tagObject = result || new Parse.Object('Tag');

                tagObject.set('barcode', tag.barcode);
                tagObject.set('name', tag.name);
                tagObject.set('STATUS', tag.status);

                await tagObject.save();
                resolve(true);
            }).catch((err) => {
                resolve(false);
            });
        });

        promises.push(tagPromise);
    });

    return Promise.all(promises).then(() => {
        return true;
    }).catch((err) => {
        console.log('[!] - >>>>> ERROR <<<<< - [!]\n' + err);
        return false;
    });
};

migrateData.migrateProduct = function (request) {
    const ProductsData = require('./data/Products.json').Products;

    if (!_.isArray(ProductsData)) {
        console.log('[!] - >>>>> ERROR <<<<< - [!]\nData Error');
        return false;
    }    
    console.log('migrate '+ ProductsData.length);

    let promises = [];
    ProductsData.forEach((product) => {
        let Query = new Parse.Query('Product');
        Query.equalTo('barcode', product.barcode);

        const productPromise = new Promise((resolve) => {
            Query.first().then(async (result) => {
                let productObject = result || new Parse.Object('Product');
                
                productObject.set('barcode', product.barcode);
                productObject.set('name', product.name);
                productObject.set('STATUS', product.status);
                productObject.set('price', product.price);
                productObject.set('amount', product.amount);

                const pointerToTag = await UTILS.createPointerTo('Tag', 'barcode', product.tag.toString());
                
                productObject.set('tag', pointerToTag);
                await productObject.save();
                resolve(true);
            }).catch((err) => {
                resolve(false);
            });
        });

        promises.push(productPromise);
    });

    return Promise.all(promises).then(() => {
        return true;
    }).catch((err) => {
        console.log('[!] - >>>>> ERROR <<<<< - [!]\n' + err);
        return false;
    });
};

module.exports = migrateData