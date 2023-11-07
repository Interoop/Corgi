const mConfig = require("../../messageConfig.json");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("All information about Corgi"),
  userPermissions: [],
  botPermissions: [],
  run: async (client, interaction) => {
    const embed = new EmbedBuilder()
      .setColor(`${mConfig.embedColorInfo}`)
      .setTitle("Corgi's Info")
      .setURL("https://github.com/NotLoxik/Corgi")
      .setDescription(
        "Corgi is a comprehensive moderation bot that offers a multitude of features and high-quality moderation capabilities."
      )
      .addFields(
        {
          name: "Developer",
          value: "[Loxik](https://loxik.dev)",
          inline: true,
        },
        {
          name: "Repository",
          value: "[GitHub](https://github.com/NotLoxik/Corgi)",
          inline: true,
        },
        { name: "Language", value: "JavaScript", inline: true }
      )
      .setThumbnail(
        "https://cdn.discordapp.com/app-icons/1170021475500179457/8012a2d4abd4fb3fa09492676aef6b5e.png?size=256&quot"
      );

    await interaction.reply({ embeds: [embed] });
  },
};
