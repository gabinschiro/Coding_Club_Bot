import { Events } from "discord.js";
import { ExtendedClient } from "../../interface/extended_client";

module.exports = (client: ExtendedClient) => {
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    await command.execute(interaction);
  });
};