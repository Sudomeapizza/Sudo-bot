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
                // case value.replace(/\s+/g, '') == "<@823697716076347423>" ||
                //     value.replace(/\s+/g, '') == "@Sudo Bot#2104":
                case message.content.replace(/\s+/g, '') == "<@823697716076347423>":
                    // response(message, 1, message.has(message.guild.members.cache.get(823697716076347423)));
                    console.log("recognized was only a ping")
                    response(message, 1, `${getArray("wiki")}`);
                    break;
                // case value:
                //     break;
                default:
                    break;
            }
        }

        if (message.author.id === '210932800000491520') {
            if (message.content.toLowerCase().includes("joinvc")) {
                // voice.joinVoiceChannel([`1076645111301161024`]);
                const connection = joinVoiceChannel({
                    channelId: message.member.voice.channelId,
                    guildId: message.guild.id, 
                    adapterCreator: message.guild.voiceAdapterCreator,
                    selfDeaf: false
                });
                message.delete();

                // client.channels.cache.get("1076645111301161024").join().then(connection => {
                //     // Yay, it worked!
                //     console.log("Successfully connected.");
                //   }).catch(e => {
                //     // Oh no, it errored! Let's log it to console :)
                //     console.error(e);
                //   });
            }
            // COMMAND NO EXIST??
            // if (message.content.toLowerCase().includes("leavevc")) {
            //     voice.getVoiceConnection(`1076645111301161024`).disconnect();
            //     message.guild.me.voice.channel.leave()
            // }
        }
        
        if (message.author.id === '165615258965114880') {
            if (Math.floor(Math.random() * 10) == 0) {
                if (message.content.toLowerCase().includes("bloody")) {
                    message.channel.send(`${getArray("bloodyGif")}`);
                }
            }
        }
        timeConvert(message);
    })
}

function response(message, chance, responseMessage) {
    if (Math.floor(Math.random() * chance) == 0) {
        message.channel.send(responseMessage);
    }
}