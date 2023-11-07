const axios = require("axios");
const mConfig = require("../../messageConfig.json");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("git-repo")
        .setDescription("Get information about a GitHub repository")
        .addStringOption(option => option.setName("username")
            .setDescription("GitHub username")
            .setRequired(true)
        )
        .addStringOption(option => option.setName("repository")
            .setDescription("GitHub repo name")
            .setRequired(true)
        ),
    userPermissions: [],
    botPermissions: [],
    deleted: true,
    run: async (client, interaction) => {
        const username = interaction.options.getString("username");
        const repository = interaction.options.getString("repository");

        try {
            const response = await axios.get(`https://api.github.com/repos/${username}/${repository}`);
            const repoData = response.data;

            const repoName = repoData.name;
            const repoDescription = repoData.description;
            const repoURL = repoData.html_url;
            const repoIconURL = repoData.owner.avatar_url;
            const repoLanguages = repoData.language;

            const embed = new EmbedBuilder()
                .setColor(`${mConfig.embedColorInfo}`)
                .setTitle(repoName)
                .setURL(repoURL)
                .setDescription(repoDescription.substring(0, 100))
                .addFields(
                    { name: "Owner", value: username, inline: true },
                    { name: "Repository", value: repository, inline: true },
                    { name: "Language", value: repoLanguages, inline: true },
                )
                .setThumbnail(repoIconURL);

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            // console.error(error);

            if (error.response && error.response.status === 404) {
                await interaction.reply({ content: "The GitHub repository does not exist.", ephemeral: true });
            } else {
                await interaction.reply({ content: "Failed to fetch repository information.", ephemeral: true });
            }
        }
    },
};