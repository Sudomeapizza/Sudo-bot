const { timeConvert } = require('../../helpers/timestampcalc.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const { getArray } = require('../../helpers/replycalc.js');

module.exports = (client) => {
    
    // I ain't questioning it, but it WORKS
    client.on("messageCreate", async (message, interaction) => {
        if (message.author.bot) return false;

        //console.log("message created: " + message.content);
        //message.channel.send(`You said: ${message.content}`);

        // If the bot gets pinged
        if (message.content.includes("<@823697716076347423>")) {
            switch (true) {
                // if " pet " is mentioned
                case message.content.includes(" pet "):
                    response(message, 1, `*pets you instead*`);
                    break;
                // if The Bot is the only content of the message
                case message.content.replace(/\s+/g, '') == "<@823697716076347423>":
                    // response(message, 1, message.has(message.guild.members.cache.get(823697716076347423)));
                    console.log("recognized was only a ping")
                    response(message, 1, getArray("wiki"));
                    break;
                // case value:
                //     break;
                default:
                    break;
            }
        }

        if (message.author.id === '210932800000491520') {
            var connection;
            if (message.content.toLowerCase().includes("joinvc")) {
                // voice.joinVoiceChannel([`1076645111301161024`]);
                if (connection != null) {
                    connection = joinVoiceChannel({
                        channelId: message.member.voice.channelId,
                        guildId: message.guild.id, 
                        adapterCreator: message.guild.voiceAdapterCreator,
                        selfDeaf: false
                    });
                } else {
                    message.author.send({
                        content: `I'm already in another channel!\nhttps://discord.com/channels/${connection.guildId}/${connection.channelId}`
                    });
                }
                message.delete();

            }
            // maybe workie?
            if (message.content.toLowerCase().includes("leavevc")) {
                connection.destroy();
                connection = null;
                message.delete();
            }
        }
        
        if (message.author.id === '165615258965114880') {
            if (Math.floor(Math.random() * 10) == 0) {
                if (message.content.toLowerCase().includes("bloody")) {
                    message.channel.send(`${getArray("bloodyGif")}`  || "None2");
                }
            }
        }
        timeConvert(message);
    })
}

function response(message, chance, responseMessage) {
    if (Math.floor(Math.random() * chance) == 0) {
        console.log("++" + responseMessage);
        message.channel.send(responseMessage || "None1");
    }
}