const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription("return the pinnng")
    .addStringOption(option =>
        option.setName('silents')
        .setDescription('shhhhh (true)')
        ),
    async execute(interaction, client) {

        const silence = interaction.options.getString('silents') || 'false';

        if (silence) {
            const message = await interaction.deferReply({
                fetchReply: true,
                ephemeral: true
            });
        } else {
            const message = await interaction.deferReply({
                fetchReply: true
            });
        }

        const newMessage = `API Latency: ${client.ws.ping}\n`
        + `Client Ping: ${message.createdTimestamp - interaction.createdTimestamp}`;
        
        
        if (silence) {
            await interaction.editReply({
                content: newMessage,
                ephemeral: true
            });
        } else {
            await interaction.editReply({
                content: newMessage
            });
        }

    }

}