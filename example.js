const { Client } = require('discord.js-selfbot-v13');
const axios = require('axios');
const fetch = require('node-fetch');

const _scarnoxKey = "YOUR_API_KEY"

const client = new Client({
    captchaSolver: async function (captcha, UA) {
        try {
            const response = await axios.post(
                'https://api.scarnox.com/api/tasks/create',
                {
                    sitekey: captcha.captcha_sitekey,
                    host: 'discord.com',
                    proxy: '', // Optional +0.15$ cost if not used! or else 0.6$ if sent
                    rqdata: captcha.captcha_rqdata,
                },
                {
                    headers: { Authorization: `Bearer ${_scarnoxKey}` }, timeout: 120000
                }
            );
            return response.data.token || response.data;
        } catch (err) {
            console.error('Captcha solver failed:', err.message);
            return null;
        }
    },
    captchaRetryLimit: 3,
});

async function addBotToGuild(client, botId, guildId) {
    if (!client || !botId || !guildId) {
        throw new Error('Missing required parameters: client, botId, or guildId.');
    }

    // Convert the url however you want!
    // 1. Construct the target OAuth2 authorization link
    const oauth2Url = `https://discord.com/oauth2/authorize?client_id=${botId}&permissions=8&integration_type=0&scope=bot`;

    try {
        // 2. Pass explicitly assigned configuration options to bypass layout validation flags
        const response = await client.authorizeURL(oauth2Url, {
            guild_id: guildId,
            permissions: 0,
            scopes: ['bot'] // Populates necessary form flags required by Discord's API backend
        });

        return response;
    } catch (error) {
        console.error(`OAuth2 Authorization Failed for Bot ${botId} in Guild ${guildId}:`, error);
        throw error;
    }
}

// --- Command Listener --- 
// USAGE: !add botId ServerID
client.on('messageCreate', async (message) => {
    if (message.content.startsWith('!add ')) {
        const args = message.content.split(' ');
        const botId = args[1];
        const guildId = message.guild.id;

        if (!botId) {
            return message.reply('❌ Please specify a Bot ID.');
        }

        try {
            message.reply(`⏳ Authorizing Bot to server ${guildId}...`);

            // Execute the newly created function
            await addBotToGuild(client, botId, guildId);

            message.reply('✅ Bot successfully added to the server!');
        } catch (error) {
            message.reply(`❌ Failed to authorize bot. Error: ${error.message}`);
        }
    }
});



client.login('YOUR TOKEN');
