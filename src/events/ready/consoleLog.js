require("colors");
const mongoose = require("mongoose");
const mongoURL = process.env.MONGO_URL;

module.exports = async (client) => {
  console.log(
    `[INFO] Logged in as ${client.user.tag} in ${client.guilds.cache.size} servers!`
      .green
  );
  console.log(`[INFO] Client ID: ${client.user.id}`.cyan);
  console.log(`[INFO] Node Version: ${process.version}`.cyan);

  if (!mongoURL) return;
  mongoose.set("strictQuery", true);
  if (await mongoose.connect(mongoURL)) {
    console.log(`[INFO] Connected to the databse!`.green);
  }
};
