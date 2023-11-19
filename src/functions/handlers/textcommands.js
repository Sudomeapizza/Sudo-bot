const { timeConvert } = require('../../helpers/timestampcalc.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const { getArray } = require('../../helpers/replycalc.js');

module.exports = (client) => {
    
    // I ain't questioning it, but it WORKS
    client.on("messageCreate", async (message, interaction) => {
        if (message.author.bot) return false;

        // If the bot gets pinged
        if (message.content.includes("<@823697716076347423>")) {
            switch (true) {
                // if " pet " is mentioned
                case message.content.includes(" pet "):
                    response(message, 1, `*pets you instead*`);
                    break;
                // if The Bot is the only content of the message
                case message.content.replace(/\s+/g, '') == "<@823697716076347423>":
                    console.log("workie0");
                    response(message, 1, getArray("wiki"));
                    console.log("workie3");
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
                    console.log("None.1");
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
        console.log("workie2.5");
        message.channel.send(responseMessage || "None1");
        console.log("workie2.6");
    }
}