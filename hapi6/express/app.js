
const api = require("@opentelemetry/api")
const Hapi = require('hapi');
const {models} = require("../sequelize")

const server = new Hapi.Server();
server.connection({
    port: 3001,
    host: 'localhost'
});

server.route({
    method: 'GET',
    path: '/api/users',
    handler: async (request, reply)  => {
		const users = await models.user.findAll();
		await models.user.findAll();
		await models.user.findAll();
        reply(users);
    }
});
server.route({
    method: 'GET',
    path: '/api/instruments',
    handler: async (request, reply)  => {
		const users = await models.instrument.findAll();
        reply(users);
    }
});
server.ext({
    type: 'onRequest',
    method: function (request, reply) {
        const currentSpan = api.trace.getSpan(api.context.active());
		const { traceId } = currentSpan.spanContext();
		console.log(traceId + " " + request.path)
        return reply.continue();
    }
});
server.start((err) => {
    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});

