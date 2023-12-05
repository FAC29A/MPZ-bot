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

    // send the question
    await interaction.reply(
      `**Question:** ${decodedQuestion}\n*Answer in the next message.*`
    );

    // check if interaction is in DM
    const isDM =
      interaction.channel === null || interaction.channel.type === "DM";

    // create a filter for messages
    const filter = (m) => m.author.id === interaction.user.id;

    // define collector for answer
    let collector;
    if (isDM) {
      // in DMs, use the DM channel to create a collector
      collector = (await interaction.user.createDM()).createMessageCollector({
        filter,
        time: 30000,
        max: 1,
      });
    } else {
      // in guilds, use the channel where the command was executed
      collector = interaction.channel.createMessageCollector({
        filter,
        time: 30000,
        max: 1,
      });
    }

    collector.on("collect", (m) => {
      if (m.content.toLowerCase() === triviaData.correct_answer.toLowerCase()) {
        interaction.followUp("Correct answer!");
      } else {
        interaction.followUp(
          `Oops, the correct answer was: ${triviaData.correct_answer}`
        );
      }
    });

    collector.on("end", (collected) => {
      if (collected.size === 0) {
        interaction.followUp("You did not answer in time.");
      }
    });
  },
};
