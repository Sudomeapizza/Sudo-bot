const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('Timestamp')
    .setDescription("Give a timestamp code"),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true
        });
        
        await interaction.editReply({
            content: null
        });
    }
}