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

const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');


rollbar.reportMessage('Hello World!');

const server = new Hapi.Server(); //We create a server object
server.connection({
	port: 4444,
});

const options = {
	info: {
		'title': 'Test API documentation',
		'version': Pack.version,
		'description': 'This is a sample example of API documentation',
	},
};

server.register([
	Inert,
	Vision,
	{
		register: HapiSwagger, 
		options: options,
	},

	], (err) => {
		server.start((err) => {
			if(err) {
			throw err;
	}
	console.log('Server running at: ', server.info.uri);
	});
//After we add a conncetion to the server, passing the port number to listen on


//after we start the server and log that its running

	server.route({
		method: 'get',
		path: '/store/{id}',
		config: handlers.storeUpdates,
	})

	handlers.storeUpdates = {
		tags: ['api'],
		description: 'Creating a new documentation for another route',
		plugins: {
			'hapi-swagger': {
				responses: {'400': {'description': 'bad request'}},
			}
		}
	}

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

			console.log('Substracting %d to 40 gives %d', Utils.y, Utils.substractY(40));
			
			var u = new Utils.User();
			
				u.name = 'Lisethe';
				u.email = 'hello@lisethe.com';
				u.dob = Moment().format('DD-MM-YYYY');
				

			console.log('The object\'s values: ', u.name, u.email);
			console.log(u);

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
						sum: function(){
							return Utils.xxx(53);
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
	server.route({
		method: 'get',
		path: '/',
		handler: funtion(req, res){
			return reply('Soy el panel de administracion!');

		}
	})
})



