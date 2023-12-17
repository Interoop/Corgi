require("dotenv/config");

const { Client, GatewayIntentBits } = require("discord.js");
const eventHandler = require("./handlers/eventHandler");
const { errorHandler } = require("./utils/errorHandler");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

errorHandler(client);
eventHandler(client);

client.login(process.env.TOKEN);
