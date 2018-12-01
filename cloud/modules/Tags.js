'use strict';
const _ = require('lodash');
const UTILS = require('../../helpers/UTILS');

const TagsModule = {};

TagsModule.getTagList = function (request) {
    const tagQuery = new Parse.Query('Tag');
    tagQuery.ascending('name');

    return tagQuery.find().then((result) => {
        return result;
    });
};

module.exports = TagsModule;