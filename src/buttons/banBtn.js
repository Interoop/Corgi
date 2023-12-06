const { EmbedBuilder, PermissionFlagsBits, Embed } = require("discord.js");
const mConfig = require("../messageConfig.json");
const moderationSchema = require("../schemas/moderation");

module.exports = {
  customId: "banBtn",
  userPermissions: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],

  run: async (client, interaction) => {
    const { message, channel, guildId, guild, user } = interaction;

    console.log(message.embeds[0]);

    const embedAuthor = message.embeds[0].data.author;
    const fetchedMembers = await guild.members.fetch({
      query: embedAuthor.name,
      limit: 1,
      force: true,
    });
    const targetMember = fetchedMembers.first();

    const rEmbed = new EmbedBuilder()
      .setAuthor({
        name: targetMember.user.username,
        iconURL: targetMember.user.displayAvatarURL({ dynamic: true }),
      })
      .setColor("FFFFFF")
      .setDescription(
        `\`❔\` What is the reason to ban ${targetMember.user.username}?\n\n\`❕\` You have 15 seconds to reply. After this time the moderation will be automatically cancelled.\n\n\`💡\` To continue without a reason, answer with \`-\`\n\`💡\` To cancel this moderation, answer with \`cancel\`.`
      );

    message.edit({ embeds: [rEmbed], components: [] });

    const filter = (m) => m.author.id === user.id;
    const reasonCollector = await channel
      .awaitMessages({ filter, max: 1, time: 15_000, errors: ["time"] })
      .then((reason) => {
        if (reason.first().content.toLowerCase() === "cancel") {
          reason.first().delete();
          rEmbed
            .setColor(mConfig.embedColorError)
            .setDescription(`\`❌\` Moderation cancelled.`);
          message.edit({ embeds: [rEmbed] });
          setTimeout(() => {
            message.delete();
          }, 2_000);
          return;
        }
        return reason;
      })
      .catch(() => {
        rEmbed
          .setColor(mConfig.embedColorError)
          .setDescription(`\`❌\` Moderation cancelled.`);
        message.edit({ embeds: [rEmbed] });
        setTimeout(() => {
          message.delete();
        }, 2_000);
        return;
      });
    const reasonObj = reasonCollector?.first();
    if (!reasonObj) return;

    let reason = reasonObj.content;
    if (reasonObj.content === "-") {
      reason = "No reason specified.";
    }
    reasonObj.delete();

    targetMember.ban({
      reason: `${reason}`,
      deleteMessagesSeconds: 60 * 60 * 24 * 7,
    });

    let dataGD = await moderationSchema.findOne({ GuildID: guildId });
    const { LogChannelID } = dataGD;
    const loggingChannel = guild.channels.cache.get(LogChannelID);

    const lEmbed = new EmbedBuilder()
      .setColor("FFFFFF")
      .setTitle("New user moderated!")
      .setDescription(
        `\`💡\` To unban ${targetMember.user.username}, use \`/unban ${targetMember.user.id}\` to rekove this ban.`
      )
      .addFields(
        {
          name: "Type",
          value: `Ban`,
          inline: true,
        },
        {
          name: "User",
          value: targetMember.user.username,
          inline: true,
        },
        {
          name: "Banned by",
          value: `<@${user.id}>`,
          inline: true,
        },
        {
          name: "Reason",
          value: reason,
          inline: true,
        }
      );

    loggingChannel.send({ embeds: [lEmbed] });

    rEmbed
      .setColor(mConfig.embedColorSuccess)
      .setDescription(
        `\`✅\` Successfully banned ${targetMember.user.username}.`
      );

    message.edit({ embeds: [rEmbed] });
    setTimeout(() => {
      message.delete();
    }, 2_000);
  },
};
