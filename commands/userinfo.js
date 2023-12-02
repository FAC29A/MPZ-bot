const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Get your Discord user info"),
  async execute(interaction) {
    const user = interaction.user;
    await interaction.reply(
      `Your username: ${user.username}\nYour ID: ${user.id}`
    );
  },
};
