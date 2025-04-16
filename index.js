require('dotenv').config(); // Loads environment variables from .env file

const { Client, GatewayIntentBits } = require('discord.js');
const music = require('discord.js-musicbot-plugin');

// Create a new Discord client with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ]
});

// Load the bot token and voice channel ID from the environment variables
const TOKEN = process.env.DISCORD_BOT_TOKEN;
const VOICE_CHANNEL_ID = process.env.VOICE_CHANNEL_ID;

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  // Ignore bot messages
  if (message.author.bot) return;

  // Check if the message starts with a command
  const prefix = '!';
  const args = message.content.trim().split(/\s+/);
  const command = args[0].toLowerCase();

  // If the user sends a !play command
  if (command === `${prefix}play`) {
    if (!message.member.voice.channel) {
      return message.reply('❌ You need to join a voice channel first!');
    }

    const voiceChannel = message.member.voice.channel;

    // Join the voice channel
    const connection = music.join(message, voiceChannel);
    console.log(`🎤 Joined voice channel: ${voiceChannel.name}`);

    // Initialize the music plugin with the client and voice channel
    music.init(client, voiceChannel);

    // Pass the message to the play command
    client.music.play(message);
  }

  // Handle other music commands (skip, replay, etc.)
  switch (command) {
    case `${prefix}skip`:
      client.music.skip(message);
      break;
    case `${prefix}replay`:
      client.music.replay(message);
      break;
    case `${prefix}clear`:
      client.music.clear(message);
      break;
    case `${prefix}volume`:
      client.music.volume(message);
      break;
    default:
      break;
  }
});

// Log the bot in
client.login(TOKEN);
