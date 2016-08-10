const Hapi = require('hapi'); // We require Hapi module
const Promise = require('bluebird');
const Request = require('request');
const _ = require('lodash');
const Moment = require('moment');
const Xml2js = require('xml2js');
var parseXmlString = Xml2js.parseString;
var builder = new Xml2js.Builder();
var Utils = require('./modules/utils.js');
var rollbar = require('rollbar');
rollbar.init('17824e35ffaf40b0adac734c09a889f2');

rollbar.reportMessage('Hello World!');

const server = new Hapi.Server(); //We create a server object

//After we add a conncetion to the server, passing the port number to listen on
server.connection({
	port: 4444,
});

//after we start the server and log that its running
server.start((err) => {
	if(err) {
		throw err;
	}
	console.log('Server running at: ', server.info.uri);

	server.route({
		method: 'GET',
		path: '/lender/{goldmineId}',
		handler: function(req, reply){
			const lwh = {
				url: 'http://192.168.1.24'
			}
			const data = {};

			getGoldmineRecord()
				.then(buildLenderRequestData)
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

			function buildLenderRequestData(){
				return new Promise(function(resolve, reject){
					var exampleRequest = {
						name: data.goldmineRecord.app1['first-name'],
						dob: function() {
							return Moment(data.goldmineRecord.app1.dob).format('DD-MM-YYYY');
						},
					}
				data.xmlOutput = Utils.serialize(exampleRequest);
				console.log(112, data.xmlOutput);
				var convertProposalInXml = builder.buildObject(data.xmlOutput);
				data.xmlConverted = convertProposalInXml;
				return resolve();
				});
			}
		}
	})
})



