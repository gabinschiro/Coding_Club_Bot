import { Client } from "discord.js";

module.exports = (client: Client) => {
  client.once("ready", () => {
    console.log(`Logged in as ${client.user?.tag}`);
  });
};
