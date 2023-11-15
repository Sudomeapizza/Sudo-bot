const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('user')
    .setDescription("give deets"),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true
        });

        const newMessage = 
        `Display name: ${interaction.user.displayName}\nUsername: ${interaction.user.username}\nUser ID: ${interaction.user.id}`;
        await interaction.editReply({
            content: newMessage
        });
    }
}