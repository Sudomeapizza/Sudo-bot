const { SlashCommandBuilder } = require('discord.js')

client.on("messageCreate", async (message) => {
    if (message.author.bot) return false;
    if (message.content.includes("ping1")) {
        console.log(message);
        // message.send(`heyo1`);
    }
})

module.exports = {
    async execute(interaction, client) {

        const silence = interaction.options.getBoolean('silents') || false;
        

    }

}