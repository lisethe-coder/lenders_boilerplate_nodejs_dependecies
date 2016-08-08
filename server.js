const Hapi = require('hapi'); // We require Hapi module
const Promise = require('bluebird');
const Request = require('request');
const _ = require('lodash');
const Moment = require('moment');
const Xml2js = require('xml2js');
var parseXmlString = Xml2js.parseString;
var builder = new Xml2js.Builder();

const server = new Hapi.Server(); //We create a server object

//After we add a conncetion to the server, passing the port number to listen on
server.connection({
	port: 4444,
});

//after we start the server and log that its running
server.start((err) =>{
	if(err){
		throw err;
	}
	console.log('Server running at: ', server.info.uri);

	server.route({
		method: 'GET',
		path: '/lendable/{goldmineId}',
		handler: function(req, reply){
			const lwh = {
				url: 'http://192.168.1.24'
			}
			const data = {};

			getGoldmineRecord()
				.then(buildXml)
				.then(() => {
					reply(data);
				})

			function getGoldmineRecord(){
				return new Promise(function(resolve, reject){
					Request({
						url: lwh.url + '/goldmine-records/' + req.params.goldmineId
					}, function(error, response, body){
						if(error){
							return reject(error);
						} 
						data.goldmineRecord = JSON.parse(body).data.attributes;
						return resolve()
					})
				})
			}

			function builLendableQuoteRequest(){
				return new Promise(function(resolve, reject){

			function serialize(obj) {

                        	return _.forEach(obj, function(value, key) { // key = a; value = 1
                            	if (typeof value == "function") {
                                return obj[key] = value();
                            }

                            	if (typeof value == "object") {
                                return obj[key] = serialize(value);
                            }

                            obj[key] = value;
                        })
                    }
				data.xml = serialize(xml);
				var convertProposalInXml = builder.buildObject(data.xml);
				data.xmlConverted = convertProposalInXml;
				return resolve();
				});
			}
		}
	})
})



