'use strict';
const _ = require('lodash');
const UTILS = require('../../helpers/UTILS');

const TagsModule = {};

TagsModule.getTagsList = function (request) {
    const tagQuery = new Parse.Query('Tag');
    const includeSample = request.params.includeSample;
    const queryPaging = UTILS.pageCalc(request.params.page, request.params.perPage);
    if (queryPaging) {
        tagQuery.skip(queryPaging.offset);
        tagQuery.limit(queryPaging.limit);
    }

    tagQuery.ascending('name');

    return tagQuery.find().then((result) => {
        let promises = [];



        result.forEach((tag, index) => {
            let productPromises = [];

            const countProducts = new Parse.Query('Product');
            countProducts.ascending('objectId');

            const innerQuery = new Parse.Query('Tag');
            innerQuery.equalTo("objectId", tag.id);

            countProducts.matchesQuery("tag", innerQuery);

            productPromises.push(countProducts.count());

            if (includeSample) {
                const sampleProductQuery = _.clone(countProducts);
                sampleProductQuery.limit(5);
                productPromises.push(sampleProductQuery.find());

            }

            promises.push(Promise.all(productPromises).then((productResult) => {
                const sampleList = includeSample ? productResult[1] : undefined;
                const totalProducts = productResult[0];
                tag = tag.toJSON();
                tag['totalProducts'] = totalProducts;
                tag['sampleProduct'] = sampleList ? sampleList.map((product) => product.toJSON()) : undefined;
                result[index] = tag;
                return Promise.resolve(true);
            }));
        });

        return Promise.all(promises).then(() => {
            return result;
        });
    });
};

module.exports = TagsModule;