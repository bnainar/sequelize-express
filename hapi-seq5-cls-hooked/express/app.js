const Hapi = require("hapi");
const { models } = require("../sequelize");
const { ns } = require("../cls");
const { v4 } = require("uuid");

const server = new Hapi.Server();
server.connection({
  port: 3000,
  host: "localhost",
});

server.ext({
  type: 'onRequest',
  method: function (request, reply) {
    ns.run(() => {
      // ns.set("test", 1)
      ns.set("traceId", v4());
      console.log(`${ns.get("traceId")} ${request.method} ${request.path}`)
      return reply.continue();
    })
  }
});
const wrapHandler = (handler) => {
  return async function newHandler(...args) {
    // ns.run(async () => {
      return await handler.call(this, ...args);
    // });
  };
};
server.route({
  method: "GET",
  path: "/api/users",
  handler: wrapHandler(async (request, reply) => {
    const users = await models.user.findAll();
    await models.user.findAll();
    await models.user.findAll();

    reply(users);
  }),
});
server.route({
  method: "GET",
  path: "/api/instruments",
  handler: wrapHandler(async (request, reply) => {
    const users = await models.instrument.findAll();
    reply(users);
  }),
});

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log(`Server running at: ${server.info.uri}`);
});
