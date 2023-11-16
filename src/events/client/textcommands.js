// const { SlashCommandBuilder } = require('discord.js')

console.log("text1");

module.exports = {
    name: 'textcommands',

    async execute(client) {
        console.log("text2");
        client.on("messageCreate", async (message) => {
            if (message.author.bot) return false;
            if (message.content.includes("ping1")) {
                console.log(message);
                console.log("message created: " + message.content);
                // message.send(`heyo1`);
            }
        })
        
        // client.on("messageCreate", async (message) => {
        //     if (message.author.bot) return false;
        //     if (message.content.includes("ping1")) {
        //         console.log(message);
        //         // message.send(`heyo1`);
        //     }
        // })

    }

}