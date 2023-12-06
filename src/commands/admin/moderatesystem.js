const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
} = require("discord.js");
const moderationSchema = require("../../schemas/moderation");
const mConfig = require("../../messageConfig.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("moderatesystem")
    .setDescription("An advanced moderating system.")
    .addSubcommand((s) =>
      s
        .setName("configure")
        .setDescription(
          "Configures the advanced moderating system into the server."
        )
        .addChannelOption((s) =>
          s
            .setName("logging_channel")
            .setDescription("The channel where all moderations will be logged.")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
    )

    .addSubcommand((s) =>
      s
        .setName("remove")
        .setDescription(
          "Removes the advanced moderation system from the server."
        )
    )
    .toJSON(),
  userPermissions: [PermissionFlagsBits.ManageGuild],
  botPermissions: [PermissionFlagsBits.ManageGuild],

  run: async (client, interaction) => {
    const { options, guildId, guild } = interaction;
    options.getSubcommand();
    const subcmd = options.getSubcommand();
    if ([("configure", "remove")].includes(subcmd)) return;

    const rEmbed = new EmbedBuilder();

    switch (subcmd) {
      case "configure":
        const loggingChannel = options.getChannel("logging_channel");

        let dataGD = await moderationSchema.findOne({ GuildID: guildId });
        if (!dataGD) {
          rEmbed
            .setColor(mConfig.embedColorWarning)
            .setDescription(
              "`⌛` New server detected: Configuring the advanced moderation system..."
            );

          await interaction.reply({
            embeds: [rEmbed],
            fetchReply: true,
            ephemeral: true,
          });

          dataGD = new moderationSchema({
            GuildID: guildId,
            LogChannelID: loggingChannel.id,
          });
          dataGD.save();

          rEmbed
            .setColor(mConfig.embedColorSucces)
            .setDescription(`\`✅\` Successfully configured moderation system.`)
            .addFields({
              name: "Logging channel",
              value: `${loggingChannel}`,
              inline: true,
            });

          setTimeout(async () => {
            interaction.editReply({ embeds: [rEmbed], ephemeral: true });
          }, 2_000);
        } else {
          await moderationSchema.findOneAndUpdate(
            { GuildID: guildId },
            { LogChannelID: loggingChannel.id }
          );

          rEmbed
            .setColor(mConfig.embedColorSucces)
            .setDescription(`\`✅\` Successfully updated moderation system.`)
            .addFields({
              name: "Logging channel",
              value: `${loggingChannel}`,
              inline: true,
            });

          interaction.reply({ embeds: [rEmbed], ephemeral: true });
        }
        break;
      case "remove":
        const removed = await moderationSchema.findOneAndDelete({
          GuildID: guildId,
        });
        if (removed) {
          rEmbed
            .setColor(mConfig.embedColorSucces)
            .setDescription(`\`✅\` Successfully removed moderation system.`);
        } else {
          rEmbed
            .setColor(mConfig.embedColorError)
            .setDescription(
              `\`❌\` This server isn't configured yet.\n\n\`💡\` Use \`/moderatesystem configure\` to configure this server.`
            );
        }
        interaction.reply({ embeds: [rEmbed], ephemeral: true });
        break;
    }
  },
};
