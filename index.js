const Server = require("./node_modules/node-osc/dist/lib/Server");
const Client = require("./node_modules/node-osc/dist/lib/Client");
const fastify = require("fastify")({ logger: true });
const cors = require("@fastify/cors");

const oscServer = new Server(9001, "0.0.0.0", () => {
  console.log("OSC Server is listening");
});

const client = new Client("127.0.0.1", 9000);

const send = (name, bool) => {
  console.log(name,bool)
  client.send(name, bool);
}

process.on("SIGINT", () => {
  client.close();
  setTimeout(() => {
    console.log("OSC Client is closed");
    process.exit(0);
  }, 100);
});

fastify.register(cors);
fastify.get("/osc", (request, reply) => {
    try {
      const { arg, bool } = request.query;
      send(arg, JSON.parse(bool));
      reply.send({ message: 'Data received and parsed successfully' });
    } catch (error) {
      console.error('Error parsing request body:', error);
      reply.code(400).send({ error: 'Bad Request' });
    }
});

// Start the server
const start = async () => {
  try {
    await fastify.listen(3001);
    fastify.log.info(`Server is listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
