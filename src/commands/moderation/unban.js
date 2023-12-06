const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const mConfig = require("../../messageConfig.json");
const moderationSchema = require("../../schemas/moderation");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Revoke a server ban.")
    .addStringOption((o) =>
      o
        .setName("user-id")
        .setDescription("The ID of the user you want to unban.")
        .setRequired(true)
    )
    .toJSON(),
  userPermissions: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],
  run: async (client, interaction) => {
    const { options, guildId, guild, member } = interaction;

    const userId = options.getString("user-id");

    let data = await moderationSchema.findOne({ GuildID: guildId });
    if (!data) {
      rEmbed
        .setColor(mConfig.embedColorError)
        .setDescription(
          `\`❌\` This server isn't configured yet.\n\n\`💡\` Use \`/moderatesystem configure\` to configure this server.`
        );
      return interaction.reply({ embeds: [rEmbed], ephemeral: true });
    }

    if (userId === member.id) {
      rEmbed
        .setColor(mConfig.embedColorError)
        .setDescription(`${mConfig.unableToInteractWithYourself}`);
      return interaction.reply({ embeds: [rEmbed], ephemeral: true });
    }
    guild.members.unban(userId);

    const rEmbed = new EmbedBuilder()
      .setColor(mConfig.embedColorSucces)
      .setDescription(`\`✅\` Successfully revoked the ban of \`${userId}\`.`);

    interaction.reply({ embeds: [rEmbed], ephemeral: true });
  },
};
