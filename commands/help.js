const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("List all commands or info about a specific command 📝"),
  async execute(interaction) {
    let helpMessage = "**Available Commands:**\n\n";
    interaction.client.commands.forEach((cmd) => {
      let commandUsage = `/${cmd.data.name}`;

      // append command options, if any
      const options = cmd.data.options;
      if (options && options.length > 0) {
        commandUsage +=
          " " + options.map((option) => `[${option.name}]`).join(" ");
      }

      let description = cmd.data.description;
      if (cmd.data.name === "play") {
        description =
          "Display a song from YouTube 📺(auto-play: disabled)";
      }

      helpMessage += `${commandUsage}: ${description}\n`;
    });

    // add note about OpenAI integration
    helpMessage +=
      "\n**Note:** In the server, I can assist with general queries using OpenAI integration. Currently, I am experiencing issues responding to DMs with OpenAI, but I'm here to help in the server channels!\n";
    helpMessage +=
      "You can also mention me in any channel or send me a direct message for general assistance!";

    await interaction.reply(helpMessage);
  },
};
