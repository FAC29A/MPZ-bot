const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Responds with Pong! 🏓"),
  async execute(interaction) {
    await interaction.reply("Pong!🏓");
  },
};
