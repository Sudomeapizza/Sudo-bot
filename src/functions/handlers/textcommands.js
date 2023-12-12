const { timeConvert } = require('../../helpers/timestampcalc.js');
// const { joinVoiceChannel } = require('@discordjs/voice');
const { getArray } = require('../../helpers/replycalc.js');
const { joinVoiceChannel, VoiceConnection, VoiceConnectionStatus, VoiceConnectionDisconnectReason, VoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const { Events } = require('discord.js');

// module.exports = {
// 	name: Events.VoiceStateUpdate,
// 	execute(client) {
// 		console.log(``);
// 	},
// };


module.exports = (client) => {
    var connection, connectionvalues;
    var stayonvc = false;

    client.on(Events.VoiceStateUpdate, (oldState, newState) => {
        const botId = client.user.id;
      
        // Check if the bot has been disconnected from a voice channel
        if (oldState.member && oldState.member.user.id === botId && !oldState.channel) {
          console.log('Bot has been disconnected from a voice channel.');
          // Your logic here
        }
      });

    // connection.on("disconnect", async () => {
    //     console.log("DISCONNECTED")
    //     if (stayonvc) {
    //         console.log("RECONNECTED");
    //         connection = joinVoiceChannel({
    //             channelId: connectionvalues.channelId,
    //             guildId: connectionvalues.guild.id, 
    //             adapterCreator: connectionvalues.guild.voiceAdapterCreator,
    //             selfDeaf: false
    //         });
    //     }
    // })
    
    // I ain't questioning it, but it WORKS
    client.on("messageCreate", async (message) => {
        if (message.author.bot) return false;

        //If the bot gets pinged
        if (message.content.includes("<@823697716076347423>")) {
            switch (true) {
                // if " pet " is mentioned
                case message.content.includes(" pet "):
                    console.log("pet");
                    response(message, 1, `*pets you instead*`);
                    break;
                // if The Bot is the only content of the message
                case message.content.replace(/\s+/g, '') == "<@823697716076347423>":
                    response(message, 1, getArray("wiki"));
                    break;
                default:
                    console.log("uh oh");
                    break;
            }
        }

        // stuff for joining vc's
        if (message.author.id === '210932800000491520') {
            
            console.log("Sudo sent a msg");
            if (message.content.toLowerCase().includes("joinvc")) {
                console.log("joinvc");
                // voice.joinVoiceChannel([`1076645111301161024`]);
                if (connection == null) {
                    console.log("connection");
                    connectionvalues = message;
                    stayonvc = true;
                    console.log("stayonvc true");
                    connection = joinVoiceChannel({
                        channelId: connectionvalues.channelId,
                        guildId: connectionvalues.guild.id, 
                        adapterCreator: connectionvalues.guild.voiceAdapterCreator,
                        selfDeaf: false
                    });
                } else {
                    console.log("None.1");
                    message.author.send({
                        content: `I'm already in another channel!\nhttps://discord.com/channels/${connection.guildId}/${connection.channelId}`
                    });
                }
                console.log("vcdelete");
                message.delete();

            }
            // maybe workie?
            if (message.content.toLowerCase().includes("leavevc")) {
                console.log("leavevc");
                message.guild.members.me.voice.disconnect()
                console.log("leavevcdelete");
                stayonvc = false;
                console.log("stayonvc false");
                message.delete();
            }
        }
        
        if (message.author.id === '165615258965114880' || message.author.id === '210932800000491520') {
            if (Math.floor(Math.random() * 10) == 0) {
                if (message.content.toLowerCase().includes("bloody")) {
                    console.log("bloody");
                    message.channel.send(`${getArray("wiki")}` || "None2");
                }
            }
        }
        timeConvert(message);
    })

    client.addListener("disconnect", async () => {
        console.log("DISCONNECTED")
        if (stayonvc) {
            console.log("RECONNECTED");
            connection = joinVoiceChannel({
                channelId: connectionvalues.channelId,
                guildId: connectionvalues.guild.id, 
                adapterCreator: connectionvalues.guild.voiceAdapterCreator,
                selfDeaf: false
            });
        }
    })
}

function response(message, chance, responseMessage) {
    if (Math.floor(Math.random() * chance) == 0) {
        console.log("workie2.5");
        console.log(responseMessage);
        message.channel.send(responseMessage || "None1");
        console.log("workie2.6");
    }
}

