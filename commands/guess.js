// commands/game.js
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("guess")
    .setDescription("Guess a number between 1 and 10 🧐")
    .addIntegerOption((option) =>
      option
        .setName("number")
        .setDescription("Enter a number")
        .setRequired(true)
    ),
  async execute(interaction) {
    const userGuess = interaction.options.getInteger("number");
    const secretNumber = Math.floor(Math.random() * 10) + 1;

    if (userGuess === secretNumber) {
      await interaction.reply(
        "Congratulations! You guessed the correct number!"
      );
    } else {
      await interaction.reply(
        `Sorry, the correct number was ${secretNumber}. Try again!`
      );
    }
  },
};
