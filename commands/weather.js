const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("weather")
    .setDescription("Get weather for a city")
    .addStringOption((option) =>
      option
        .setName("city")
        .setDescription("Name of the city")
        .setRequired(true)
    ),
  async execute(interaction) {
    const city = interaction.options.getString("city");
    try {
      const response = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
      );
      const weatherData = response.data;
      await interaction.reply(
        `Weather in ${city}: ${weatherData.main.temp}°C, ${weatherData.weather[0].description}`
      );
    } catch (error) {
      console.error("Error fetching weather:", error);
      await interaction.reply(`Could not retrieve weather for ${city}.`);
    }
  },
};
