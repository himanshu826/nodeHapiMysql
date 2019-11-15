'use strict';
const Config = require('./Config');
const Hapi = require('@hapi/hapi');
const Plugins = require('./Plugins');
const Routes = require('./Routes');

var db = require('./Config/dbConnection');
// Create a server with a host and port
(async initServer => {
    try {

        const server = new Hapi.Server({
            host: 'localhost',
            port: 3000
        })

        await server.register(Plugins);

        await server.route(Routes);
        server.events.on('response', function (request) {
            console.log(request.info.remoteAddress + ': ' + request.method.toUpperCase() + ' ' + request.path + ' --> ' + request.response.statusCode);
            console.log('Request payload:', request.payload);
        });

        server.start((err) => {
            if (err) {
                throw err;
            }
            console.log('Server running at:', server.info.uri);
        });
    } catch (err) {
        console.log('6666666666666666', err);
    }
})();