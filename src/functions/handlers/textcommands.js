const { timeConvert } = require('../../helpers/timestampcalc.js');
// const { joinVoiceChannel } = require('@discordjs/voice');
const { getArray, restart, gitpull, pokemon, pokemonStop, pushCode, getVersion } = require('../../helpers/replycalc.js');
const { joinVoiceChannel, VoiceConnection, VoiceConnectionStatus, VoiceConnectionDisconnectReason, VoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const { Events } = require('discord.js');
const Guild = require('../../schemas/guild');
const mongoose = require('mongoose');


module.exports = (client) => {
    var connection, connectionvalues;
    var stayonvc = false;

    client.on('guildCreate', async (guild) => {
        console.log(`Bot joined a new guild: ${guild.name} (id: ${guild.id}).`);
            
        var guildProfile = await Guild.findOne({ guildId: guild.id });
        if (!guildProfile) {
            guildProfile = await new Guild({
                _id: new mongoose.Types.ObjectId(),
                guildId: guild.id,
                guildName: guild.name,
                guildIcon: guild.iconURL() ? guild.iconURL() : "None..",
            })
            await guildProfile.save().catch(console.error);
            console.log(guildProfile);
        }
    });

    client.on('guildDelete', async (guild) => {
        console.log(`Bot left a guild: ${guild.name} (id: ${guild.id}).`);
    
        await Guild.findOneAndDelete({ guildId: guild.id });
    });

    client.on('voiceStateUpdate', (oldState, newState) => {
        // console.log("update to voice");
        const botId = client.user.id;
        if (stayonvc) {
            if (oldState.member && oldState.member.user.id === botId && oldState.channel){
                
                connection = joinVoiceChannel({
                    channelId: connectionvalues.channelId,
                    guildId: connectionvalues.guild.id, 
                    adapterCreator: connectionvalues.guild.voiceAdapterCreator,
                    selfDeaf: false
                });
                console.log(`reconnected!`);
            }
        }
    });

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
            
            // console.log("Sudo sent a msg");
            if (message.content.toLowerCase().includes("joinvc")) {
                console.log("joinvc");
                // voice.joinVoiceChannel([`1076645111301161024`]);
                connection = null;
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
                // connection = null;
                console.log("leavevc");
                message.guild.members.me.voice.disconnect();
                console.log("leavevcdelete");
                stayonvc = false;
                console.log("stayonvc false");
                message.delete();
            }

            if (message.content.toLowerCase().substring(0,8) == "!restart") {
                console.log("restart");
                console.log(messagess);
                const replyMessage = await message.reply({ content: "Restarting...", ephemeral: true });
                var messagess = restart(message.content.toLowerCase().split(" ")[1]).toString();
                const fetchedReplyMessage = await message.channel.messages.fetch(replyMessage.id);
                fetchedReplyMessage.edit({ content: messagess, ephemeral: true });
            }

            if (message.content.toLowerCase().substring(0,8) == "!gitpull") {
                console.log("gitpull");
                
                const replyMessage = await message.reply({ content: `Checking github...`, ephemeral: true });
                const fetchedReplyMessage = await message.channel.messages.fetch(replyMessage.id);
                fetchedReplyMessage.edit({ content: gitpull(parseInt(message.content.toLowerCase().split(" ")[1])), ephemeral: true });
            }

            if (message.content.toLowerCase().substring(0,11) == "!getversion") {
                console.log("getversion");

                const replyMessage = await message.reply({ content: `Checking Version...`, ephemeral: true });
                const fetchedReplyMessage = await message.channel.messages.fetch(replyMessage.id);
                fetchedReplyMessage.edit({ content: getVersion(message.content.toLowerCase().split(" ")[1]), ephemeral: true });
            }

            if (message.content.toLowerCase().substring(0,9) == "!pushcode") {
                console.log("Pushcode");
                
                const replyMessage = await message.reply({ content: `Pushing Github...`, ephemeral: true });
                const fetchedReplyMessage = await message.channel.messages.fetch(replyMessage.id);

                function extractValues(inputString) {
                    const regex = /"([^"]*)"/g;
                    const matches = inputString.match(regex);
                  
                    if (!matches || matches.length < 2) return null;

                    const title = matches[0].replace(/"/g, '');
                    const body = matches[1].replace(/"/g, '');

                    return { title, body };
                }
                
                // Example usage:
                const values = extractValues(message.content.toLowerCase());
                console.log(values);
                if (values) {
                    fetchedReplyMessage.edit({ content: pushCode(values.title,values.body), ephemeral: true });
                } else {
                    fetchedReplyMessage.edit({ content: `!pushcode "title" "body"`, ephemeral: true });
                }
            }
        }
        
        if (message.author.id === '210932800000491520' || message.author.id === '1166148722867056681' || message.author.
id === "308766485461991434") {
            // if (message.content.toLowerCase().includes("pokemon")) {
            if (message.content.toLowerCase().substring(0,8) == "!pokemon") {
                console.log("pokemon");
                var option = message.content.toLowerCase().substring(8);
                var messagess, replyMessage;
                if (option == 'stop') {
                    replyMessage = await message.reply({ content: "Stopping...", ephemeral: true });
                    messagess = pokemonStop().toString();
                } else {
                    replyMessage = await message.reply({ content: `Starting up ${option}...`, ephemeral: true });
                    messagess = pokemon(option).toString();
                }
                console.log(messagess);
                const fetchedReplyMessage = await message.channel.messages.fetch(replyMessage.id);
                fetchedReplyMessage.edit({ content: messagess, ephemeral: true });
            }
        }

        //if (message.author.id === '165615258965114880' || message.author.id === '210932800000491520') {
            // if (Math.floor(Math.random() * 10) == 0) {
            //      if (message.content.toLowerCase().includes("bloody")) {
            //        console.log("bloody");
            //        message.channel.send(`${getArray("wiki")}` || "None2");
            //    }
            // }
        //}

        // convert messages
        var localTimeZone = await client.getTimeZone(message.author.id);
        if (localTimeZone) {
            const result = timeConvert(message, localTimeZone.timeZone);
            if (result) {
                console.log(result);
                message.channel.send(result);
            }
        } else {
            // maybe something?
            console.log(`No time region set for {${message.author.tag} : ${message.author.id}}`);
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
