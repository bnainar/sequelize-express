const api = require("@opentelemetry/api");
const Hapi = require("hapi");
const { models } = require("../sequelize");
const { ns } = require("../cls");
const { v4 } = require("uuid");

const server = new Hapi.Server();
server.connection({
  port: 3000,
  host: "localhost",
});
//
server.route({
  method: "GET",
  path: "/api/users",
  handler: async (request, reply) => {
    ns.run(async () => {
      ns.set("traceId", v4());
      const users = await models.user.findAll();
      await models.user.findAll();
      await models.user.findAll();

      reply(users);
    });
  },
});
server.route({
  method: "GET",
  path: "/api/instruments",
  handler: async (request, reply) => {
    ns.run(async () => {
      ns.set("traceId", v4());
      const users = await models.instrument.findAll();
      reply(users);
    });
  },
});
server.start((err) => {
  if (err) {
    throw err;
  }
  console.log(`Server running at: ${server.info.uri}`);
});
