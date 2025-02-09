import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, PermissionsBitField, CommandInteractionOptionResolver } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("addparticipant")
  .setDescription("Ajouter un rôle participant à un utilisateur.")
  .addUserOption(option => 
    option.setName("utilisateur")
      .setDescription("L'utilisateur à qui ajouter le rôle.")
      .setRequired(true)
  )
  .addStringOption(option => 
    option.setName("date")
      .setDescription("La date du rôle participant à ajouter (format JJ/MM/AA).")
      .setRequired(true)
  );

export const execute = async (interaction: CommandInteraction): Promise<void> => {
  await interaction.deferReply();

  const options = interaction.options as CommandInteractionOptionResolver;
  const user = options.getUser("utilisateur");
  const date = options.getString("date");

  if (!date) {
    await interaction.followUp("Erreur : La date est requise.");
    return;
  }

  if (!interaction.guild) {
    await interaction.followUp("Erreur : Impossible de trouver le serveur.");
    return;
  }

  const member = await interaction.guild.members.fetch(user!.id);
  const hasAdminPermission = member.permissions.has(PermissionsBitField.Flags.Administrator);
  const encadrantRole = member.roles.cache.find(role => role.name.toLowerCase().includes("encadrant") && role.name.includes(date));

  if (!hasAdminPermission && !encadrantRole) {
    await interaction.followUp("Erreur : Vous devez avoir les permissions administrateur ou un rôle 'encadrant' contenant la date pour ajouter un rôle participant.");
    return;
  }

  const role = interaction.guild.roles.cache.find(role => role.name === `Participant ${date}`);

  if (!role) {
    await interaction.followUp(`Erreur : Le rôle 'Participant ${date}' n'existe pas.`);
    return;
  }

  await member.roles.add(role);
  await interaction.followUp(`Le rôle 'Participant ${date}' a été ajouté à ${user!.username}.`);
};

module.exports = { data, execute };
