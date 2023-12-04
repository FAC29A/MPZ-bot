const { SlashCommandBuilder } = require("@discordjs/builders");
const youtubeSr = require("youtube-sr").default;
const ytdl = require("ytdl-core");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Display a song from YouTube 📺")
    .addStringOption((option) =>
      option.setName("song").setDescription("The name of the song to display 🎶")
    )
    .addStringOption((option) =>
      option.setName("url").setDescription("The YouTube URL of the song 🔗")
    ),
  async execute(interaction) {
    const songName = interaction.options.getString("song");
    const songUrlInput = interaction.options.getString("url");

    let songUrl;
    let songTitle;

    if (songName) {
      try {
        const searchResults = await youtubeSr.search(songName, { limit: 1 });
        if (!searchResults || searchResults.length === 0) {
          await interaction.reply(
            "No results found for the song name provided."
          );
          return;
        }
        songUrl = `https://www.youtube.com/watch?v=${searchResults[0].id}`;
        songTitle = searchResults[0].title;
      } catch (error) {
        console.error(error);
        await interaction.reply("There was an error searching for the song.");
        return;
      }
    } else if (songUrlInput) {
      if (!ytdl.validateURL(songUrlInput)) {
        await interaction.reply("Please enter a valid YouTube URL.");
        return;
      }
      songUrl = songUrlInput;
      try {
        const videoInfo = await ytdl.getInfo(songUrl);
        songTitle = videoInfo.videoDetails.title;
      } catch (error) {
        console.error(error);
        await interaction.reply(
          "There was an error retrieving the video details."
        );
        return;
      }
    } else {
      await interaction.reply("Please provide a song name or a YouTube URL.");
      return;
    }

    // song information without playing it automatically
    await interaction.reply(`Song: [${songTitle}](${songUrl})`);
  },
};


// ---------------AUTO STREAM CODE BELOW-------------------- //


// const { SlashCommandBuilder } = require("@discordjs/builders");
// const {
//   entersState,
//   joinVoiceChannel,
//   createAudioPlayer,
//   createAudioResource,
//   AudioPlayerStatus,
//   VoiceConnectionStatus,
// } = require("@discordjs/voice");
// const ytdl = require("ytdl-core");
// const youtubeSr = require("youtube-sr").default;

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName("play")
//     .setDescription("Play a song from YouTube")
//     .addStringOption((option) =>
//       option.setName("song").setDescription("The name of the song to play")
//     )
//     .addStringOption((option) =>
//       option.setName("url").setDescription("The YouTube URL of the song")
//     ),
//   async execute(interaction) {
//     const songName = interaction.options.getString("song");
//     const songUrlInput = interaction.options.getString("url");

//     let songUrl;
//     let songTitle;

//     if (songName) {
//       try {
//         const searchResults = await youtubeSr.search(songName, { limit: 1 });
//         if (!searchResults || searchResults.length === 0) {
//           await interaction.reply(
//             "No results found for the song name provided."
//           );
//           return;
//         }
//         songUrl = `https://www.youtube.com/watch?v=${searchResults[0].id}`;
//         songTitle = searchResults[0].title;
//       } catch (error) {
//         console.error(error);
//         await interaction.reply("There was an error searching for the song.");
//         return;
//       }
//     } else if (songUrlInput) {
//       if (!ytdl.validateURL(songUrlInput)) {
//         await interaction.reply("Please enter a valid YouTube URL.");
//         return;
//       }
//       songUrl = songUrlInput;
//       try {
//         const videoInfo = await ytdl.getInfo(songUrl);
//         songTitle = videoInfo.videoDetails.title;
//       } catch (error) {
//         console.error(error);
//         await interaction.reply(
//           "There was an error retrieving the video details."
//         );
//         return;
//       }
//     } else {
//       await interaction.reply("Please provide a song name or a YouTube URL.");
//       return;
//     }

//     let member = interaction.member;
//     if (!member) {
//       try {
//         member = await interaction.guild.members.fetch(interaction.user.id);
//       } catch (error) {
//         console.error(error);
//         await interaction.reply("Failed to fetch member data.");
//         return;
//       }
//     }

//     const channel = member.voice.channel;
//     if (!channel) {
//       await interaction.reply("You need to join a voice channel first!");
//       return;
//     }

//     try {
//       const connection = joinVoiceChannel({
//         channelId: channel.id,
//         guildId: interaction.guildId,
//         adapterCreator: interaction.guild.voiceAdapterCreator,
//       });

//       const stream = ytdl(songUrl, { filter: "audioonly" });
//       const resource = createAudioResource(stream);
//       const player = createAudioPlayer();

//       player.play(resource);
//       connection.subscribe(player);

//       player.on(AudioPlayerStatus.Playing, () => {
//         console.log("The audio is now playing!");
//       });

//       player.on(AudioPlayerStatus.Idle, () => {
//         console.log("Playback has stopped.");
//         connection.destroy();
//       });

//       connection.on(VoiceConnectionStatus.Disconnected, async () => {
//         try {
//           await Promise.race([
//             entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
//             entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
//           ]);
//         } catch (error) {
//           console.error(error);
//           connection.destroy();
//         }
//       });

//       await interaction.reply(`Now playing: [${songTitle}](${songUrl})`);

//     } catch (error) {
//       console.error(error);
//       await interaction.reply("There was an error trying to play the song.");
//     }
//   },
// };