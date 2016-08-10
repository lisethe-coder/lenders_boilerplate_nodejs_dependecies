const _ = require('lodash');

var serialize = function serialize(obj) {
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

var addSum = function (value){
	var x = 5;
	return value + x;
}

var y = 2;
var substractY = function(valor){
	return valor - y;
}

var User = function(name, email){
	this.name = name;
	this.email = name;
}

module.exports = {
	xxx: addSum,
	serialize: serialize,
	y: y,
	substractY: substractY,
	User: User,
}


