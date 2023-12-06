const mConfig = require("../../messageConfig.json");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { Wordle } = require("discord-gamecord");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wordle")
    .setDescription("Play worlde minigame"),
  userPermissions: [],
  botPermissions: [],
  run: async (client, interaction) => {
    const Game = new Wordle({
      message: interaction,
      isSlashGame: true,
      embed: {
        title: "Wordle",
        color: mConfig.embedColorNone,
      },
      customWord: null,
      timeoutTime: 60000,
      winMessage: mConfig.wordleWin,
      loseMessage: mConfig.wordleLost,
      playerOnlyMessage: mConfig.cannotUseBotton,
    });

    Game.startGame();
    Game.on("gameOver", (result) => {
      // console.log(result); // =>  { result... }
    });
  },
};
