const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription("return the pinnng")
    .addBooleanOption(option =>
        option.setName('silents')
        .setDescription('shhhhh (true)')
        ),
    async execute(interaction, client) {

        const silence = interaction.options.getBoolean('silents') || false;
        var message;

        if (silence) {
            message = await interaction.deferReply({
                fetchReply: true,
                ephemeral: true
            });
        } else {
            message = await interaction.deferReply({
                fetchReply: true
            });
        }

        const newMessage = `API Latency: ${client.ws.ping}\n`
        + `Client Ping: ${message.createdTimestamp - interaction.createdTimestamp}`;
        
        
        if (silence) {
            await interaction.editReply({
                fetchReply: true,
                content: newMessage,
                ephemeral: true
            });
        } else {
            await interaction.editReply({
                fetchReply: true,
                content: newMessage
            });
        }

    }

}