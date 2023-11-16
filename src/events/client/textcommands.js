// const { SlashCommandBuilder } = require('discord.js')

console.log("text1");

module.exports = {
    name: 'textcommands',

    async execute(interaction, client) {

        client.on("messageCreate", async (message) => {
            if (message.author.bot) return false;
            console.log("message created: " + message.content);
        })

    }

}