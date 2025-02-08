import { Client, Events, Collection } from "discord.js";

interface ExtendedClient extends Client {
  commands: Collection<string, any>;
}

module.exports = (client: ExtendedClient) => {
  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    await command.execute(interaction);
  });
};