const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");
const he = require("he");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("trivia")
    .setDescription("Starts a trivia question 🤔"),
  async execute(interaction) {
    // fetch a trivia question
    const response = await axios.get(
      "https://opentdb.com/api.php?amount=1&type=multiple"
    );
    const triviaData = response.data.results[0];

    // decode HTML entities
    const decodedQuestion = he.decode(triviaData.question);

    // defer the reply
    await interaction.deferReply();

    // send the question
    await interaction.editReply(
      `**Question:** ${decodedQuestion}\n*Answer in the next message.*`
    );

    // await response from user
    const filter = (m) => m.author.id === interaction.user.id;
    try {
      const collected = await interaction.channel.awaitMessages({
        filter,
        max: 1,
        time: 30000,
      });
      const answer = collected.first().content;

      // check the answer
      if (answer.toLowerCase() === triviaData.correct_answer.toLowerCase()) {
        await interaction.followUp("Correct answer!");
      } else {
        await interaction.followUp(
          `Oops, the correct answer was: ${triviaData.correct_answer}`
        );
      }
    } catch (error) {
      await interaction.followUp("You did not answer in time.");
    }
  },
};
