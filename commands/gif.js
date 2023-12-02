const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gif")
    .setDescription("Get a random GIF"),
  async execute(interaction) {
    try {
      const response = await axios.get(
        `http://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHY_API_KEY}`
      );
      const gifUrl = response.data.data.images.original.url;
      await interaction.reply({ files: [gifUrl] });
    } catch (error) {
      console.error("Error fetching GIF:", error);
      await interaction.reply("Failed to retrieve a GIF.");
    }
  },
};
