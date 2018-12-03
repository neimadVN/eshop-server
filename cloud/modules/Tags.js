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

        if (includeSample) {

            result.forEach((tag, index) => {
                const sampleProductQuery = new Parse.Query('Product');
                sampleProductQuery.ascending('objectId');

                const innerQuery = new Parse.Query('Tag');
                innerQuery.equalTo("objectId", tag.id);

                sampleProductQuery.matchesQuery("tag", innerQuery);
                sampleProductQuery.limit(5);

                promises.push(sampleProductQuery.find().then((sampleList) => {
                    tag = tag.toJSON();
                    tag['sampleProduct'] = sampleList;
                    result[index] = tag;
                    return Promise.resolve(true);
                }));
            });
        }

        return Promise.all(promises).then(() => {
            return result;
        });
    });
};

module.exports = TagsModule;