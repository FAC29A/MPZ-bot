# Team MPZ Discord Bot

## Overview

This Discord bot, developed by Team MPZ, provides various fun and utility commands for users in a Discord server. The bot can fetch GIFs, memes, weather information, jokes, and more. It is designed to be interactive and responsive to user commands.

## Getting Started

1. Clone this repository to your local machine.
2. Install dependencies by running `npm install`.
3. Create a `.env` file in the project root and add the following environment variables:
   - `GIPHY_API_KEY`: API key for Giphy.
   - `WEATHER_API_KEY`: API key for OpenWeatherMap.
   - `DISCORD_TOKEN`: Discord bot token.

## Usage

1. Run the bot by executing `node index.js` in the terminal.
2. Use commands in a Discord server by prefixing them with `!`.

## Available Commands

- `!gif`: Get a random GIF.
- `!ping`: Pong!
- `!echo [message]`: Echo a message.
- `!userinfo`: Get your Discord user info.
- `!meme`: Get a random meme.
- `!weather [city]`: Get the weather for a city.
- `!greet`: Greet the bot.
- `!joke`: Get a random joke.
- `!help`: Display a list of available commands.

## Implementation Details

- The bot uses the Discord.js library for interacting with the Discord API.
- It fetches data from Giphy, Imgflip (for memes), OpenWeatherMap, and an official joke API.
- The bot responds to specific commands triggered by the user in the Discord server.

## Contributors

This project was developed as part of a collaborative effort by Team MPZ:
- Paing
- Marika 
- Zukhra.


