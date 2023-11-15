const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('timestamp')
    .setDescription("Give a timestamp code")

    .addStringOption(option =>
        option.setName('date')
        .setDescription('the date in MMDDYYYY')
        .setRequired(true)
        .setMaxLength(8)
        .setMinLength(8)
        )
    .addStringOption(option =>
        option.setName('time')
        .setDescription('the time in HHMM<SS>')
        .setRequired(true)
        .setMaxLength(6)
        .setMinLength(4)
        )
    .addStringOption(option =>
        option.setName('format')
        .setDescription('optional format')
        .addChoices(
            {name: 'Realitive Time', value: 'R'},
            {name: 'Long Date', value: 'D'},
            {name: 'Short Date', value: 'd'},
            {name: 'Lone Time', value: 'T'},
            {name: 'Short Time', value: 't'},
            {name: 'Long Time/Date', value: 'F'},
            {name: 'Short Time/Date', value: 'f'},
        )),


    async execute(interaction, client) {

        const date = interaction.options.getString('date');
        const time = interaction.options.getString('time');
        const format = interaction.options.getString('format');

        var fullResponse = `${date}\n${time}\n${format}`;

        const message = await interaction.reply({
            content: fullResponse,
            fetchReply: true,
            ephemeral: true
        });
        
        // await interaction.editReply({
        //     content: null,
        //     ephemeral: true
        // });
    }
}