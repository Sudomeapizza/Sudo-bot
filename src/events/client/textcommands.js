// const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    name: 'textcommands',

    async execute(client) {

        client.on("messageCreate", async (message) => {
            if (message.author.bot) return false;
            if (message.content.includes("ping1")) {
                console.log(message);
                // message.send(`heyo1`);
            }
        })
        
        client.on("messageCreate", async (message) => {
            if (message.author.bot) return false;
            if (message.content.includes("ping1")) {
                console.log(message);
                // message.send(`heyo1`);
            }
        })

    }

}