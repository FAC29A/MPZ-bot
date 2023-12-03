const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
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
  console.log(`Received message: ${message.content}`);
  if (message.author.bot) return;

  // direct messages
  if (message.channel.type === "DM") {
    console.log("Handling a DM"); 
    handleDirectMessage(message);
    return;
  }

  // mentions
  if (message.mentions.users.has(client.user.id)) {
    console.log("Bot was mentioned");
    handleMentions(message);
    return;
  }
});

async function handleMentions(message) {
  console.log("Responding to a mention");
  // Respond to mention here
  message.channel.send("**Hello! How can I assist you today?**");

  // Logging mention
  const logEntry = {
    timestamp: new Date().toISOString(),
    author: message.author.tag,
    messageContent: message.content,
    channel: message.channel.name,
  };
  console.log("Mention Log:", logEntry);
  // save this log to database ??
}

async function handleDirectMessage(message) {
  try {
    console.log("Responding to DM"); // debugging log
    await message.author.send("Hello! How can I help you in DM?");
  } catch (error) {
    console.error("Error in handleDirectMessage:", error);
  }
}


client.login(process.env.DISCORD_TOKEN);
