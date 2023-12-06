const { model, Schema } = require("mongoose");

let moderationSchema = new Schema(
  {
    GuildID: String,
    LogChannelID: String,
  },
  { strict: false }
);

module.exports = model("moderation", moderationSchema);
