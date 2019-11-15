const HapiSwagger = require('hapi-swagger');
const Pack = require('../package');

exports.plugin = {
	name: 'swagger-plugin',
	register: async (server) => {
		const swaggerOptions = {
            info: {
                title: 'Hapi MySql API Documentation',
                version: Pack.version,
            },
        };
		await server.register([
			{
				plugin: HapiSwagger,
				options: swaggerOptions
			}
        ]);
        console.log('Swagger Loaded')
	}
};
