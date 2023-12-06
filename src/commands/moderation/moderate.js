const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const mConfig = require("../../messageConfig.json");
const moderationSchema = require("../../schemas/moderation");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("moderate")
    .setDescription("Moderate a server member.")
    .addUserOption((o) =>
      o.setName("user").setDescription("User to moderate.").setRequired(true)
    )
    .toJSON(),
  userPermissions: [
    PermissionFlagsBits.ModerateMembers,
    PermissionFlagsBits.BanMembers,
    PermissionFlagsBits.KickMembers,
  ],
  botPermissions: [
    PermissionFlagsBits.ModerateMembers,
    PermissionFlagsBits.BanMembers,
    PermissionFlagsBits.KickMembers,
  ],

  run: async (client, interaction) => {
    const { options, guildId, guild, member } = interaction;

    const user = options.getUser("user");
    const targetMember = await guild.members.fetch(user);

    const rEmbed = new EmbedBuilder().setColor("FFFFFF");

    let data = await moderationSchema.findOne({ GuildID: guildId });
    if (!data) {
      rEmbed
        .setColor(mConfig.embedColorError)
        .setDescription(
          `\`❌\` This server isn't configured yet.\n\n\`💡\` Use \`/moderatesystem configure\` to configure this server.`
        );
      return interaction.reply({ embeds: [rEmbed], ephemeral: true });
    }

    if (targetMember.id === member.id) {
      rEmbed
        .setColor(mConfig.embedColorError)
        .setDescription(`${mConfig.unableToInteractWithYourself}`);
      return interaction.reply({ embeds: [rEmbed], ephemeral: true });
    }

    if (targetMember.roles.highest.position >= member.roles.highest.position) {
      rEmbed
        .setColor(mConfig.embedColorError)
        .setDescription(`${mConfig.hasHigherRolePosition}`);
      return interaction.reply({ embeds: [rEmbed], ephemeral: true });
    }

    const moderationButtons = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId("banBtn")
        .setLabel("Server ban")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("kickBtn")
        .setLabel("Server kick")
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId("cancelBtn")
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Secondary)
    );

    rEmbed
      .setDescription(
        `\`❔\` What action do you want to use against ${targetMember.user.username}?`
      )
      .setAuthor({
        name: targetMember.user.username,
        iconURL: targetMember.user.displayAvatarURL({ dynamic: true }),
      });

    interaction.reply({ embeds: [rEmbed], components: [moderationButtons] });
  },
};
