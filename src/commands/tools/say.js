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
        await interaction.reply({
            message: "."
        });

        // const usermessage = interaction.options.getString('message');

        // if (usermessage != ""){
        //     client.channels.cache.get(`${interaction.channelId}`).send(usermessage || "None7");

            // await interaction.reply({
            //     message: "."
            // });

            // await interaction.deleteReply({});
        // }
    }
}