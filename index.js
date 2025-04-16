require('dotenv').config(); // Load .env variables

const { Client, GatewayIntentBits } = require('discord.js');
const music = require('discord.js-musicbot-plugin');

// Create Discord client with proper intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ]
});

// Get values from .env
const TOKEN = process.env.DISCORD_BOT_TOKEN;
const VOICE_CHANNEL_ID = process.env.VOICE_CHANNEL_ID;

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  const voiceChannel = client.channels.cache.get(VOICE_CHANNEL_ID);
  if (!voiceChannel || voiceChannel.type !== 2) { // 2 = GUILD_VOICE
    console.error('❌ Voice channel not found or invalid.');
    return;
  }

  music.init(client, voiceChannel);
  console.log('🎵 Music plugin initialized.');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const prefix = '!';
  const [cmd] = message.content.trim().split(/\s+/);

  switch (cmd) {
    case `${prefix}play`:
      client.music.play(message);
      break;
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
  }
});

// Login using the bot token
client.login(TOKEN);
