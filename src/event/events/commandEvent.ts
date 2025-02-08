import { Events } from "discord.js";
import { ExtendedClient } from "../../interface/extendedClient";

module.exports = (client: ExtendedClient): void => {
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return;

    const command: any = client.commands.get(interaction.commandName);

    if (!command) return;

    await command.execute(interaction);
  });
};