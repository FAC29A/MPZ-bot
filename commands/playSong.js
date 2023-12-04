const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
} = require("@discordjs/voice");
const ytdl = require("ytdl-core");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song from YouTube 🎶")
    .addStringOption((option) =>
      option
        .setName("url")
        .setDescription("The URL of the YouTube video")
        .setRequired(true)
    ),
  async execute(interaction) {
    const songUrl = interaction.options.getString("url");

    // validate URL
    if (!ytdl.validateURL(songUrl)) {
      await interaction.reply("Please enter a valid YouTube URL.");
      return;
    }

    const channel = interaction.member.voice.channel;
    if (!channel) {
      await interaction.reply("You need to join a voice channel first!");
      return;
    }

    try {
      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: interaction.guildId,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

      const stream = ytdl(songUrl, { filter: "audioonly" });
      const resource = createAudioResource(stream);
      const player = createAudioPlayer();

      player.play(resource);
      connection.subscribe(player);

      player.on(AudioPlayerStatus.Playing, () => {
        console.log("The audio is now playing!");
      });

      player.on(AudioPlayerStatus.Idle, () => {
        console.log("Playback has stopped.");
        connection.destroy();
      });

      connection.on(VoiceConnectionStatus.Disconnected, async () => {
        try {
          await Promise.race([
            entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
            entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
          ]);
        } catch (error) {
          connection.destroy();
        }
      });

      await interaction.reply(`Now playing: ${songUrl}`);
    } catch (error) {
      console.error(error);
      await interaction.reply("There was an error trying to play the song.");
    }
  },
};
