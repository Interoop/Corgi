const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const mConfig = require("../../messageConfig.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Delete a specific number of messages provided.")
    .addIntegerOption((o) =>
      o
        .setName("amount")
        .setDescription("Number of messages to delete from the channel.")
        .setMinValue(0)
        .setMaxValue(100)
        .setRequired(true)
    )
    .addUserOption((o) =>
      o
        .setName("user")
        .setDescription(
          "Number of messages to delete from a specific user in a channel."
        )
    ),
  userPermissions: [PermissionFlagsBits.ManageMessages],
  botPermissions: [PermissionFlagsBits.ManageMessages],

  run: async (client, interaction) => {
    const { channel, options } = interaction;

    let amount = options.getInteger("amount");
    const target = options.getUser("user");
    const multiMsg = amount === 1 ? "message" : "messages";

    const errEmbed = new EmbedBuilder().setColor(mConfig.embedColorError);
    const clearEmbed = new EmbedBuilder().setColor(mConfig.embedColorSucces);

    if (!amount || amount > 100 || amount < 1) {
      errEmbed.setDescription(
        `\`❌\` Please specify an amount between 1 and 100 before deleting messages.`
      );
      return interaction.reply({ embeds: [errEmbed], ephemeral: true });
    }

    try {
      const channelMessages = await channel.messages.fetch();

      if (channelMessages.size === 0) {
        errEmbed.setDescription(`\`❌\` There are no messages to delete.`);
        return interaction.reply({ embeds: [errEmbed], ephemeral: true });
      }

      if (amount > channelMessages.size) amount = channelMessages.size;

      let messagesToDelete = [];

      if (target) {
        let i = 0;
        channelMessages.forEach((m) => {
          if (m.author.id === target.id && messagesToDelete.length < amount) {
            messagesToDelete.push(m);
            i++;
          }
        });

        clearEmbed.setDescription(
          `\`✅\` Succesfully cleared \`${messagesToDelete.lenght}\` from ${target} in ${channel}.`
        );

        return interaction.reply({ embeds: [clearEmbed], ephemeral: true });
      } else {
        messagesToDelete = channelMessages.first(amount);
        clearEmbed.setDescription(
          `\`✅\` Succesfully cleared \`${messagesToDelete.lenght}\` ${multiMsg} in ${channel}.`
        );
      }

      if (messagesToDelete.lenght > 0) {
        await channelMessages.bulkDelete(messagesToDelete, true);
      }

      return interaction.editReply({ embeds: [clearEmbed] });
    } catch (error) {
      errEmbed.setDescription(
        `\`❌\` An error occurred while deleting messages.`
      );
      console.log(error);
      await interaction.followUp({ embeds: [errEmbed], ephemeral: true });
    }
  },
};
