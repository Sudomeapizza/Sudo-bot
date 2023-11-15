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

        const silence = interaction.options.getString('silents') || false;
        var message;

        if (silence) {
            console.log(silence);
            message = await interaction.deferReply({
                fetchReply: true,
                ephemeral: true
            });
        } else {
            console.log(silence);
            message = await interaction.deferReply({
                fetchReply: true
            });
        }

        const newMessage = `API Latency: ${client.ws.ping}\n`
        + `Client Ping: ${message.createdTimestamp - interaction.createdTimestamp}`;
        
        
        if (silence) {
            console.log(silence);
            await interaction.editReply({
                fetchReply: true,
                content: newMessage,
                ephemeral: true
            });
        } else {
            console.log(silence);
            await interaction.editReply({
                fetchReply: true,
                content: newMessage
            });
        }

    }

}