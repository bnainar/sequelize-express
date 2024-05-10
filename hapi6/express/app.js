const api = require("@opentelemetry/api");
const Hapi = require("hapi");
const { models } = require("../sequelize");
const axios = require("axios");
// const { Client } = require("undici");
const server = new Hapi.Server();
server.connection({
  port: 3001,
  host: "localhost",
});

async function getRequest(url) {
  const client = new Client(url);

  try {
    const { body } = await client.request({
      method: "GET",
    });

    // Convert the body stream to a string
    const responseBody = await body.text();

    console.log(responseBody);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    // Close the client
    client.close();
  }
}

server.route({
  method: "GET",
  path: "/api/users",
  handler: async (request, reply) => {
    const users = await models.user.findAll();
    await models.user.findAll();
    await models.user.findAll();
    reply(users);
  },
});
server.route({
  method: "GET",
  path: "/callblink",
  handler: async (request, reply) => {
    const traceHeaders = {};
    // inject context to trace headers for propagtion to the next service
    api.propagation.inject(api.context.active(), traceHeaders);
    // pass the trace headers to your request
    const config = {
      headers: traceHeaders,
    };
    console.log(config)
    const res = await axios.get("http://localhost:8715/health", config);
    console.log(res.data)
    //  getRequest(");
    reply(res.data);
  },
});
server.route({
  method: "GET",
  path: "/api/instruments",
  handler: async (request, reply) => {
    const users = await models.instrument.findAll();
    reply(users);
  },
});
server.ext({
  type: "onRequest",
  method: function (request, reply) {
    const currentSpan = api.trace.getSpan(api.context.active());
    const { traceId } = currentSpan.spanContext();
    console.log(traceId + " " + request.path);
    return reply.continue();
  },
});
server.start((err) => {
  if (err) {
    throw err;
  }
  console.log(`Server running at: ${server.info.uri}`);
});
