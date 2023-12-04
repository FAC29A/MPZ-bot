const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gif")
    .setDescription("Get a random GIF or search a specific term 🔎")
    .addStringOption(
      (option) =>
        option
          .setName("term")
          .setDescription("The search term for the GIF")
          .setRequired(false) // set true to make it required/ fasle for optional
    ),
  async execute(interaction) {
    const searchTerm = interaction.options.getString("term");

    try {
      const response = await axios.get(
        `http://api.giphy.com/v1/gifs/random?api_key=${
          process.env.GIPHY_API_KEY
        }&tag=${encodeURIComponent(searchTerm)}`
      );
      const gifUrl = response.data.data.images.original.url;
      await interaction.reply({ files: [gifUrl] });
    } catch (error) {
      console.error("Error fetching GIF:", error);
      await interaction.reply("Failed to retrieve a GIF.");
    }
  },
};
