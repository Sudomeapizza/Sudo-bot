require('dotenv').config();
const { token } = process.env;
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

const client = new Client({ intents: [ 
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildEmojisAndStickers,
]});
client.commands = new Collection();
client.commandArray = [];


// client.on("messageCreate", async (message) => {
//     console.log("text3");
//     const channel = client.channels.cache.get("1173069259618930808");
//     message.channel.send('message');
//     if (message.author.bot) return false;
//     if (message.content.includes("ping1")) {
//         console.log(message);
//         console.log("message created: " + message.content);
//         // message.send(`heyo1`);
//     }
// })


const functionFolders = fs.readdirSync('./src/functions');
for (const folder of functionFolders) {
    const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
    for (const file of functionFiles)
        require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleCommands();
client.login(token);