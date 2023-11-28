require("dotenv").config();
const axios = require("axios");
// discord.js version 13 
const { Client, Intents } = require("discord.js");
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
});

const giphyApiKey = process.env.GIPHY_API_KEY;
const weatherApiKey = process.env.WEATHER_API_KEY;
const memeApiUrl = "https://api.imgflip.com/get_memes";
const commandPrefix = "!";

client.once("ready", () => {
  console.log("MPZ-bot is online!");
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(commandPrefix)) return;

  const args = message.content.slice(commandPrefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "gif") {
    try {
      const response = await axios.get(
        `http://api.giphy.com/v1/gifs/random?api_key=${giphyApiKey}`
      );
      const gifUrl = response.data.data.images.original.url;
      message.channel.send({ files: [gifUrl] });
    } catch (error) {
      message.channel.send("Failed to retrieve a GIF.");
    }
  } else if (command === "ping") {
    message.channel.send("Pong!");
  } else if (command === "echo") {
    const echoMessage = args.join(" ");
    if (!echoMessage) {
      message.channel.send("Please provide a message to echo.");
    } else {
      message.channel.send(echoMessage);
    }
  } else if (command === "userinfo") {
    message.channel.send(
      `Your username: ${message.author.username}\nYour ID: ${message.author.id}`
    );
  } else if (command === "meme") {
    try {
      const response = await axios.get(memeApiUrl);
      const memes = response.data.data.memes;
      const randomMeme = memes[Math.floor(Math.random() * memes.length)];
      message.channel.send({ files: [randomMeme.url] });
    } catch (error) {
      console.error(error);
      message.channel.send("Failed to retrieve a meme.");
    }
  } else if (command === "weather") {
    if (args.length === 0) {
      message.channel.send("Please provide a city name. e.g., !weather London");
    } else {
      const city = args.join(" ");
      try {
        const response = await axios.get(
          `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`
        );
        const weatherData = response.data;
        message.channel.send(
          `Weather in ${city}: ${weatherData.main.temp}°C, ${weatherData.weather[0].description}`
        );
      } catch (error) {
        message.channel.send(`Could not retrieve weather for ${city}`);
      }
    }
  } else if (
    command === "greet" ||
    message.mentions.users.has(client.user.id)
  ) {
    message.channel.send(`Hello ${message.author.username}!`)
  }else if (command === "help") {
    message.channel.send(
      "Available commands:\n" +
        "!gif - Get a random GIF\n" +
        "!ping - Pong!\n" +
        "!echo [message] - Echo a message\n" +
        "!userinfo - Get your Discord user info\n" +
        "!meme - Get a random meme\n" +
        "!weather [city] - Get the weather for a city\n" +
        "!greet - Greet the bot"
    );
  }

  // more features
});

client.login(process.env.DISCORD_TOKEN);
