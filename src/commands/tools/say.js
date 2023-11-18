const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('say')
    .setDescription("SPEAK")
    .addStringOption(option =>
        option.setName('message')
        .setDescription('putty text here')
        ),
    async execute(interaction, client) {

        const usermessage = interaction.options.getString('message');
        // var message;

        client.channels.cache.get(`${interaction.channelId}`).send(usermessage);

        await interaction.reply({
            // message: ""
        });
        await interaction.deleteReply({});



    }

}