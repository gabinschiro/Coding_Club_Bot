import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
export const data = new SlashCommandBuilder()
  .setName("hello")
  .setDescription("Say hello to the bot");

export const execute = async (interaction: CommandInteraction) => {
  await interaction.reply("Hello!");
};

module.exports = { data, execute };