const { timeStampCalc, goToDate } = require('../../helpers/timestampcalc.js')
const { dateRegex } = require('../../helpers/regex.js');
const { getRegion } = require('../../helpers/user.js');
// const { voice } = require('../../../@discordjs/voice');
const { joinVoiceChannel, leaveVoiceChannel } = require('@discordjs/voice');
// const { joinVoiceChannel } = require('@discordjs/voice').joinVoiceChanel;


var gifs = ["https://cdn.discordapp.com/attachments/669372366710898688/1175332478563651664/image0.gif?ex=656ad8ab&is=655863ab&hm=dc4afa1be5b9f0f72829d88f9b9944a36c1f97abb8760138712009ba264b9b1a&",
"https://cdn.discordapp.com/attachments/669372366710898688/1175332479251521585/image1.gif?ex=656ad8ab&is=655863ab&hm=7cea1d7a01a7b5bdbfaa75c3202d0fbe6df0cc59a6ffb658769eba49736114ec&",
"https://media.discordapp.net/attachments/669372366710898688/1175332479612223639/image2.gif?ex=656ad8ab&is=655863ab&hm=dfa1cab4e4ad5048ea11119c56a80672fcc3b1e86cc3bb7463f4cb4cacbb293f&="]

module.exports = (client) => {
    
    // I ain't questioning it, but it WORKS
    client.on("messageCreate", async (message, interaction) => {
        if (message.author.bot) return false;

        //console.log("message created: " + message.content);
        //message.channel.send(`You said: ${message.content}`);
        
        // TODO: MAKE THIS DYNAMICALLY ADD MORE COMMANDS?
        // require()(client);

        if (message.author.id === '210932800000491520') {
            if (message.content.toLowerCase().includes("joinvc")) {
                // voice.joinVoiceChannel([`1076645111301161024`]);
                const connection = joinVoiceChannel({
                    channelId: message.member.voice.channelId,
                    guildId: message.guild.id, 
                    adapterCreator: message.guild.voiceAdapterCreator,
                    selfDeaf: false
                });

                
                //     channelId: "1076645111301161024",
                //     guildId: 1076645110390984714,
                //     adapterCreator: channel.guild.voiceAdapterCreator,
                // });

                // client.channels.cache.get("1076645111301161024").join().then(connection => {
                //     // Yay, it worked!
                //     console.log("Successfully connected.");
                //   }).catch(e => {
                //     // Oh no, it errored! Let's log it to console :)
                //     console.error(e);
                //   });
            }
            if (message.content.toLowerCase().includes("leavevc")) {
                voice.getVoiceConnection(`1076645111301161024`).disconnect();
                message.guild.me.voice.channel.leave()
            }
        }
        
        if (message.author.id === '165615258965114880') {
            if (Math.floor(Math.random() * 10) == 0) {
                if (message.content.toLowerCase().includes("bloody")) {
                    var gifMessage = Math.floor(Math.random() * 3)
                    message.channel.send(`${gif[gifMessage]}`);
                }
            }
        }
        timeConvert(message);
    })
}

function timeConvert(message) {
    if (message.guildId === '1076645110390984714'
    || message.guildId === '351882915153707008') {
        if (message.author.bot) {return;}
        var userMessage = message.content;
        const info = dateRegex(userMessage);
        if (info[0] != null) {
            // message.channel.send(info[0] + " " + info[1]);
            const targetDate = goToDate(userMessage);
            var timestamp = timeStampCalc(targetDate, info[0], getRegion(message.author.id), 'D', true);4
            var newMessage = userMessage.replace(`${info[1]} at ${info[0]}`,`${timestamp[0]} ${timestamp[1]}`);
            // var newMessage = userMessage.replace(`${info[1]} @ ${info[0]}`,`${timestamp[0]} ${timestamp[1]}`);
            if (timestamp) {
                message.channel.send(newMessage);
            } else {
                message.author.send({
                    content: "You do not have a region set internally, please specify your region.",
                    ephemeral: true
                });
            }
        } else {
            message.channel.send(info[0]);
        }
    }
}