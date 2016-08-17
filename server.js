const Hapi = require('hapi'); // Loan hapi module 
const Promise = require('bluebird');
const Request = require('request');
const _ = require('lodash');
const Moment = require('moment');
const Xml2js = require('xml2js');
var parseXmlString = Xml2js.parseString;
var builder = new Xml2js.Builder();
var Utils = require('./modules/utils.js');
var rollbar = require('rollbar');
const Joi = require('joi');
rollbar.init('17824e35ffaf40b0adac734c09a889f2');

const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');

rollbar.reportMessage('Hello World!');

const server = new Hapi.Server(); //We create a new hapi server object. A server is an object in Hapi that receive and route Requests
//I am creating a server that is connected to port 4444 
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

//after we start the server and log that its running
	const plugin = function(server, options, next) {
		//We add some routes to the server using the server.route() method 
		server.route({
			method: 'GET',
			path: '/cn/{id}',
			config: {
				tags: ['api'],
				description: 'Display the word Chinese!!',
				validate: {
					params: {
						id: Joi.string().description('the query string'),
					}
				},
				plugins: {
					'hapi-swagger': {
						responses: {
							'400': {
								'description': 'bad request'
							},
							'200': {
								'description' : 'success',
								schema: Joi.object().keys({
									scoredId: Joi.number().integer(),
								})
							}
						}
					}
				},
				handler: function (req, reply) {
					// console.log('req object', req);
					console.log('req method: ', req.method);	
				return reply({hello: req.params.id, name: 'Lisethe'}, + '/n' );
				},

			}
			
		});
		next();
	}

	const admin_plugin = function(server, options, next) {
		server.route({
			method: 'GET',
			path:'/admin', 
			handler: function (req, reply) {

				return reply ('I am the administrator panel!');

			}

		});
		next();
	}

	const adminUsers_plugin = function(server, options, next) {
		server.route({
			method: 'GET',
			path: '/admin/users',
			handler: function(req, reply) {
				return reply ('I displpay all users!');
			}
		})
		next();
	}

	const admingPosts_plugin = function(server, options, next) {

		server.route({
			method: 'GET',
			path: '/admin/posts',
			handler: function(req, reply) {
				return reply ('I display all posts!');
			}
		})
		next();

	}

	admingPosts_plugin.attributes = {
		name: 'admin posts plugin',
	}

	adminUsers_plugin.attributes = {
		name: 'admin users plugin',
	}

	admin_plugin.attributes = {
		name: 'admin plugin',
	}

	plugin.attributes = {
		name: 'my Plugin',
	}

	server.register(
		[ Inert, Vision,
			{
				register: HapiSwagger,
				options: options,
			}, 
			plugin, admin_plugin, adminUsers_plugin, admingPosts_plugin,
		], (err) => {
		server.start((err) => {
			if(err) {
			throw err;
		}
		console.log('Server running at: ', server.info.uri);
	});

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
	
})



