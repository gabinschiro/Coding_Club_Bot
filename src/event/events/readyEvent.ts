import { Events } from "discord.js";
import { ExtendedClient } from "../../interface/extendedClient";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

module.exports = (client: ExtendedClient): void => {
  client.once(Events.ClientReady, async () => {
    const rest = new REST({ version: "9" }).setToken(process.env.TOKEN as string);

    try {
      console.log("Started refreshing application (/) commands for a specific guild.");

      await rest.put(
        Routes.applicationGuildCommands(client.user?.id as string, process.env.GUILD_ID as string),
        { body: client.commandArray }
      );
      console.log("Successfully reloaded application (/) commands for the specified guild.");
    } catch (error) {
      console.error(error);
    }
    console.log(`Logged in as ${client.user?.tag}`);
  });
};