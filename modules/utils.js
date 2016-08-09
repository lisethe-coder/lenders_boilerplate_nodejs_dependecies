const _ = require('lodash');

module.exports.serialize = function serialize(obj) {
	const object = obj;
	return _.forEach(object, function(value, key) { // key = a; value = 1
        if (typeof value == "function") {
            return object[key] = value();
        }

        if (typeof value == "object") {
            return object[key] = serialize(value);
        }
            object[key] = value;
    })
}
