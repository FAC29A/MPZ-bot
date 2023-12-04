const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("meme")
    .setDescription("Get a random meme 🤭"),
  async execute(interaction) {
    try {
      const response = await axios.get(process.env.MEME_API_URL);
      const memes = response.data.data.memes;
      const randomMeme = memes[Math.floor(Math.random() * memes.length)];
      await interaction.reply({ files: [randomMeme.url] });
    } catch (error) {
      console.error("Error fetching meme:", error);
      await interaction.reply("Failed to retrieve a meme.");
    }
  },
};
