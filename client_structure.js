const { Client } = require('discord.js-selfbot-v13');
const axios = require('axios');

const _scarnoxToken = "YOUR_API_KEY"

const client = new Client({
    captchaSolver: async function (captcha, UA) {
        try {
            const response = await axios.post(
                'https://api.scarnox.com/api/tasks/create',
                {
                    site_key: captcha.captcha_sitekey,
                    captcha_type: captcha.captcha_service,
                    site_url: 'https://discord.com',
                    proxy: '', // Optional +0.15$ cost if not used! or else 0.6$ if sent
                    rqdata: captcha.captcha_rqdata,
                },
                {
                    headers: { Authorization: `Bearer ${_scarnoxKey}` }, timeout: 120000
                }
            );
            console.log(response.data.token)
            return response.data.token
        } catch (err) {
            console.error('Captcha solver failed:', err);
            return null;
        }
    },
    captchaRetryLimit: 3,
});

client.login(TOKEN)
