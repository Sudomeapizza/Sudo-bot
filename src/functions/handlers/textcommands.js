// const { SlashCommandBuilder } = require('discord.js')

module.exports = (client) => {
    // name: 'textcommands',

    // async execute(interaction, client) {

        /**
         * Works on app.js, but not here... weird....
         */
        client.on("messageCreate", async (message) => {
            if (message.author.bot) return false;
            console.log("message created: " + message.content);
            message.channel.send(`You said: ${message.content}`)
        })

    //}

}