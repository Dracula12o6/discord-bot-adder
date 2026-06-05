const { Client } = require('discord.js-selfbot-v13');
const axios = require('axios');

const _scarnoxToken = "YOUR_API_KEY"

const client = new Client({
    captchaSolver: async function (captcha, UA) {
        try {
            const response = await axios.post(
                'https://api.scarnox.com/api/tasks/create',
                {
                    sitekey: captcha.captcha_sitekey,
                    host: 'discord.com',
                    proxy: '',
                    rqdata: captcha.captcha_rqdata,
                },
                {
                    headers: { Authorization: `Bearer ${_scarnoxToken}` }, timeout: 120000
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

client.login(TOKEN)
