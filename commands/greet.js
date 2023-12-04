const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("greet")
    .setDescription("Greets the user 👋"),
  async execute(interaction) {
    // Use interaction.member.displayName if available, otherwise fall back to interaction.user.username
    const displayName = interaction.member
      ? interaction.member.displayName
      : interaction.user.username;

    const now = new Date();
    const currentHour = now.getHours();
    let timeOfDayGreeting;

    if (currentHour < 12) {
      timeOfDayGreeting = "Good morning";
    } else if (currentHour < 18) {
      timeOfDayGreeting = "Good afternoon";
    } else {
      timeOfDayGreeting = "Good evening";
    }

    const currentDate = now.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const currentTime = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    await interaction.reply(
      `${timeOfDayGreeting}, ${displayName}! It is now ${currentTime} on ${currentDate}.`
    );
  },
};
