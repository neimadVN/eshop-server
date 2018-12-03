'use strict';
const _ = require('lodash');

const UTILS = {};

UTILS.createPointerTo = (ClassName, fieldName, fieldValue) => {
    const Query = new Parse.Query(ClassName);
    Query.equalTo(fieldName, fieldValue);
    //console.log(Query);

    return Query.first().then((result) => {

        if (result) {
            const ParseObject = Parse.Object.extend(ClassName);
            return ParseObject.createWithoutData(result.id);
        } else {
            let CreatedObject = new Parse.Object(ClassName);
            CreatedObject.set(fieldName, fieldValue);
            return CreatedObject.save().then((realObject) => {
                return realObject.createWithoutData(result.id);
            });
        }
    });
};

UTILS.pageCalc = (pageNumber, perPage) => {
    if (!pageNumber)
        return null;
    perPage = perPage || 10;
    const offset = (pageNumber - 1) * perPage;
    return {offset, limit: perPage};
};

UTILS.buildPointerQuery = (className = 'Product', selectedField = []) => {
    const query = new Parse.Query(className);

    if (!_.isEmpty(selectedField)) {
        query.select(selectedField);
    }
    
    return query;
};

module.exports = UTILS;