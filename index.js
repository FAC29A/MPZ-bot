require("dotenv").config();

const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const axios = require("axios");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// slash commands
client.commands = new Collection();
const commands = [];
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log("Team MPZ-Bot is ready!");

  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(client.user.id), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.on("messageCreate", async (message) => {
  // ignore messages from bots
  if (message.author.bot) return;

  // check if the message is DM or mentions the bot in a server
  if (message.channel.type === "DM" || message.mentions.has(client.user.id)) {
    let content = message.content;

    // if the message is in server and mentions the bot, remove the mention from the message
    if (message.channel.type !== "DM") {
      content = content
        .replace(new RegExp(`<@!?${client.user.id}>`, "g"), "")
        .trim();
    }

    // generate and send a response using OpenAI API
    try {
      const reply = await generateOpenAIResponse(content);
      await message.channel.send(reply);
    } catch (error) {
      console.error(
        "Error in sending DM or processing OpenAI response:",
        error
      );
      // inform the user that an error occurred (optional)
      if (message.channel.type === "DM") {
        await message.author.send(
          "I encountered an error while processing your request."
        );
      }
    }
  }
});

// function to generate responses using OpenAI
async function generateOpenAIResponse(userMessage) {
  const conversationHistory = [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: userMessage },
  ];

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: conversationHistory,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    console.log("OpenAI API Response:", response.data);

    if (
      response.data &&
      response.data.choices &&
      response.data.choices[0] &&
      response.data.choices[0].message &&
      response.data.choices[0].message.content
    ) {
      const generatedReply = response.data.choices[0].message.content;
      console.log("Generated Reply:", generatedReply);
      return generatedReply;
    } else {
      console.error("Invalid response from OpenAI API");
      return "Failed to generate a response.";
    }
  } catch (error) {
    console.error("Error generating response:", error.message);
    return "Failed to generate a response.";
  }
}

client.login(process.env.DISCORD_TOKEN);
