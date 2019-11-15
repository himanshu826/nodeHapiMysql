const Joi = require('@hapi/joi');
const UniversalFunctions = require('../Utils/UniversalFunctions');
const Controller = require('../Controllers');
// const Controller = "";
const Config = require('../Config');

module.exports = [
    {
        method: 'GET',
        path: '/user/usersList',
        config: {
            handler: async function (request, h) {
                try {
                    console.log("request.payloadrequest.payload", request.query)
                    const Users = await Controller.UserController.usersList(request.query)
                    return (UniversalFunctions.sendSuccess(null, Users))
                } catch (err) {
                    return (UniversalFunctions.sendError(err));
                }
            },
            description: 'Users',
            notes: 'user listing',
            tags: ['api', 'user'],
            validate: {
                query: {
                    skip: Joi.string().default(0).optional(),
                    limit:Joi.string().default(20).optional(),
                },
                failAction: UniversalFunctions.failActionFunction
            },
            plugins: {
                'hapi-swagger': {
                    payloadType : 'form',
                    responses: Config.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },

]