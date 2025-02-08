import { Client, Events } from "discord.js";

module.exports = (client: Client) => {
  client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user?.tag}`);
  });
};
