const { EmbedBuilder, WebhookClient } = require("discord.js");
const mConfig = require("../messageConfig.json");
const webhook = new WebhookClient({ url: process.env.WEBHOOK_URL });

async function logError(error, stack) {
  const formatedStack =
    stack.length > 2048 ? stack.slice(0, 2045) + "..." : stack;

  const embed = new EmbedBuilder()
    .setColor(mConfig.embedColorError)
    .setTitle(`${error}`)
    .setDescription(`\`\`\`diff\n- ${formatedStack}\n\`\`\``);

  await webhook.send({ embeds: [embed] });
}

module.exports = {
  errorHandler: async (client) => {
    process.on("unhandledRejection", async (reason) => {
      await logError("UnhandledRejection", reason);
    });
    process.on("uncaughtException", async (error) => {
      if (error.message.includes("Cannot find module")) {
        const errorMessage = error.message.split("Require")[0].trim();
        const stack = error.stack.split(">")[1].split("\n")[0].trim();
        await logError(
          "UncaughtException",
          errorMessage + ` in a file ${stack}`
        );
      } else {
        await logError("UncaughtException", error);
      }
    });
    client.on("error", async (error) => {
      if (error.message.includes("Cannot find module")) {
        const errorMessage = error.message.split("Require")[0].trim();
        const reqStack = error.message.split("Require stack:")[1].trim();
        const stack = reqStack
          .split("\n")[0]
          .trim()
          .replace(/^[-\s]{2}/, "");
        await logError(
          "Discord.js Error",
          errorMessage + ` in a file (${stack})`
        );
      } else {
        await logError("Discord.js Error", error);
      }
    });
  },
};
