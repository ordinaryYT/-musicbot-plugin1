require('dotenv').config(); // 👈 loads variables from .env

const Discord = require('discord.js');
const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_CONTENT
    ]
});

const music = require('discord.js-musicbot-plugin');

// Get values from .env
const voiceChannelId = process.env.VOICE_CHANNEL_ID;
const token = process.env.DISCORD_BOT_TOKEN;

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);

    const voiceChannel = client.channels.cache.get(voiceChannelId);
    if (!voiceChannel || voiceChannel.type !== 'GUILD_VOICE') {
        console.error('Voice channel not found or invalid.');
        return;
    }

    music.init(client, voiceChannel);
    console.log('Music plugin initialized.');
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

client.login(token);
