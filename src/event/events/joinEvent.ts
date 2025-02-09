import { Events } from "discord.js";
import { ExtendedClient } from "../../interface/extendedClient";

module.exports = (client: ExtendedClient): void => {
  client.on(Events.GuildMemberAdd, async (member) => {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getFullYear()).slice(-2)}`;

    const participantRole = member.guild.roles.cache.find(role => role.name.includes(`Participant ${formattedDate}`));
    
    if (participantRole) {
      await member.roles.add(participantRole);
    }
  });
};
