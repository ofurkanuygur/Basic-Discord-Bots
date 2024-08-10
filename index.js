const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios'); // HTTP istekleri için
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
require('dotenv').config();

const apiToken = process.env.Token;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});


client.on('messageCreate', async message => {
    if (!message.content.startsWith('/Kullanıcı Sayısı') || message.author.bot) return;

    const config = {
        headers: { Authorization: `Bearer ${apiToken}` }
    };

    try {
        const response = await axios.get('https://adminturnuvam.trairsoft.com.tr/user/analytics', config);
        const data = response.data;
        const reply = `
Toplam Kullanıcı: ${data.totalUsers}
Doğrulanmış Kullanıcılar: ${data.verifiedUsers}
Yasaklanmış Kullanıcılar: ${data.bannedUsers}
Kayıt Olan Son 6 Kullanıcı: ${data.latestUsers.map(user => user.name).join(', ')}
        `;
        message.channel.send(reply);
    } catch (error) {
        message.channel.send(`API'den veri alınırken bir hata oluştu: ${error.response ? error.response.data.error : error.message}`);
    }
});
client.login(process.env.botToken); // Buraya kendi bot tokenınızı girin.
