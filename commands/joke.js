const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("joke")
    .setDescription("Get a random joke 😝"),
  async execute(interaction) {
    try {
      const response = await axios.get(
        "https://official-joke-api.appspot.com/random_joke"
      );
      const joke = `${response.data.setup}\n${response.data.punchline}`;
      await interaction.reply(joke);
    } catch (error) {
      console.error("Error fetching joke:", error);
      await interaction.reply("Failed to retrieve a joke.");
    }
  },
};
