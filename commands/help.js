const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("List all commands or info about a specific command 📝"),
  async execute(interaction) {
    let helpMessage = "**Available Commands:**\n\n";
    interaction.client.commands.forEach((cmd) => {
      let commandUsage = `/${cmd.data.name}`;

      // check if the command has options and append them to commandUsage, for echo and weather 
      const options = cmd.data.options;
      if (options && options.length > 0) {
        commandUsage +=
          " " + options.map((option) => `[${option.name}]`).join(" ");
      }

      helpMessage += `${commandUsage}: ${cmd.data.description}\n`;
    });
    helpMessage +=
      "\nYou can also mention me in any channel or send me a direct message for assistance!";

    await interaction.reply(helpMessage);
  },
};
