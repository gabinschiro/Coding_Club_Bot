import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, PermissionsBitField, CommandInteractionOptionResolver, ChannelType, OverwriteType } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("setupday")
  .setDescription("Configurer une journée de club de codage.")
  .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
  .addStringOption((option) =>
    option.setName("date").setDescription("La date à configurer (format JJ/MM/AA).").setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("theme").setDescription("Le thème de la journée.").setRequired(true)
  );

export const execute = async (interaction: CommandInteraction): Promise<void> => {
  await interaction.deferReply();

  const options = interaction.options as CommandInteractionOptionResolver;
  const date: string = options.getString("date") as string;
  const theme: string = options.getString("theme") as string;

  const dateRegex = /^\d{2}\/\d{2}\/\d{2}$/;
  if (!dateRegex.test(date)) {
    await interaction.followUp("Erreur : Le format de la date doit être JJ/MM/AA.");
    return;
  }

  const categoryName = `${theme} ${date}`;

  if (!interaction.guild) {
    await interaction.reply("Erreur : Impossible de trouver le serveur.");
    return;
  }

  const botMember = await interaction.guild.members.fetch(interaction.client.user!.id);
  const botPermissions = botMember.permissions;

  if (!botPermissions.has(PermissionsBitField.Flags.ManageRoles) || !botPermissions.has(PermissionsBitField.Flags.ManageChannels)) {
    await interaction.reply("Erreur : Le bot n'a pas les permissions nécessaires pour gérer les rôles et les canaux.");
    return;
  }

  const participantRole = await interaction.guild.roles.create({
    name: `Participant ${date}`,
    permissions: [],
    color: '#1ABC9C',
  });

  const encadrantRole = await interaction.guild.roles.create({
    name: `Encadrant ${date}`,
    permissions: [],
    color: '#E91E63',
  });

  const lowestRolePosition = interaction.guild.roles.cache.reduce((lowest, role) => {
    return role.position < lowest ? role.position : lowest;
  }, Infinity);

  try {
    await participantRole.setPosition(lowestRolePosition - 1);
    await encadrantRole.setPosition(participantRole.position + 1);
  } catch (error) {
    console.error("Erreur lors de la modification de la position des rôles :", error);
    await interaction.followUp("Erreur : Impossible de modifier la position des rôles.");
    return;
  }

  const category = await interaction.guild.channels.create({
    name: categoryName,
    type: ChannelType.GuildCategory,
    permissionOverwrites: [
      {
        id: interaction.guild.roles.everyone.id,
        deny: [PermissionsBitField.Flags.ViewChannel],
        type: OverwriteType.Role,
      },
      {
        id: participantRole.id,
        allow: [PermissionsBitField.Flags.ViewChannel],
        type: OverwriteType.Role,
      },
      {
        id: encadrantRole.id,
        allow: [PermissionsBitField.Flags.ViewChannel],
        type: OverwriteType.Role,
      }
    ],
  });

  if (!category) {
    await interaction.reply("Échec de la création de la catégorie.");
    return;
  }

  const channels = [
    { name: "encadrants", permissions: { encadrant: true, participant: false } },
    { name: "annonces", permissions: { encadrant: true, participant: true, everyone: false, write: false } },
    { name: "general", permissions: { encadrant: true, participant: true } },
    { name: "sujet-ressources", permissions: { encadrant: true, participant: true, everyone: false, write: false } },
    { name: "code", permissions: { encadrant: true, participant: true } },
    { name: "help", permissions: { encadrant: true, participant: true } }
  ];

  for (const channel of channels) {
    await interaction.guild.channels.create({
      name: channel.name,
      type: ChannelType.GuildText,
      parent: category.id,
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone.id,
          deny: channel.permissions.everyone ? [] : [PermissionsBitField.Flags.ViewChannel],
          type: OverwriteType.Role,
        },
        {
          id: participantRole.id,
          allow: [PermissionsBitField.Flags.ViewChannel],
          deny: channel.permissions.write === false ? [PermissionsBitField.Flags.SendMessages] : [],
          type: OverwriteType.Role,
        },
        {
          id: encadrantRole.id,
          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
          type: OverwriteType.Role,
        }
      ],
    });
  }

  await interaction.followUp(`Setup terminé pour la journée : ${categoryName}`);
};

module.exports = { data, execute };