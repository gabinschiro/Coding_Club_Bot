import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, PermissionsBitField, CommandInteractionOptionResolver, MessageFlags } from "discord.js";

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
  if (!interaction.guild) {
    await interaction.reply({ content: "Erreur : Impossible de trouver le serveur.", flags: MessageFlags.Ephemeral });
    return;
  }

  const options = interaction.options as CommandInteractionOptionResolver;
  const user = options.getUser("utilisateur");
  const date = options.getString("date");

  if (!date) {
    await interaction.reply({ content: "Erreur : La date est requise.", flags: MessageFlags.Ephemeral });
    return;
  }

  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const member = await interaction.guild.members.fetch(user!.id);
  const hasAdminPermission = member.permissions.has(PermissionsBitField.Flags.Administrator);
  const encadrantRole = member.roles.cache.find(role => role.name.toLowerCase().includes("encadrant") && role.name.includes(date));

  if (!hasAdminPermission && !encadrantRole) {
    await interaction.followUp({ content: "Erreur : Vous devez avoir les permissions administrateur ou un rôle 'encadrant' contenant la date pour ajouter un rôle participant.", flags: MessageFlags.Ephemeral });
    return;
  }

  const role = interaction.guild.roles.cache.find(role => role.name === `Participant ${date}`);

  if (!role) {
    await interaction.followUp({ content: `Erreur : Le rôle 'Participant ${date}' n'existe pas.`, flags: MessageFlags.Ephemeral });
    return;
  }

  if (member.roles.cache.has(role.id)) {
    await interaction.followUp({ content: `L'utilisateur ${user!.username} a déjà le rôle 'Participant ${date}'.`, flags: MessageFlags.Ephemeral });
    return;
  }

  await member.roles.add(role);
  await interaction.followUp({ content: `Le rôle 'Participant ${date}' a été ajouté à ${user!.username}.`, flags: MessageFlags.Ephemeral });
};

module.exports = { data, execute };
