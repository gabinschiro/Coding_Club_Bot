import { Client } from "discord.js";

module.exports = (client: Client): void => {
  client.once("ready", () => {
    console.log(`Logged in as ${client.user?.tag}`);
  });
};
