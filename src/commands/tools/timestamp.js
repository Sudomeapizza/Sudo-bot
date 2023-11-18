const { SlashCommandBuilder } = require('discord.js')
const { timeStampCalc } = require('../../helpers/timestampcalc.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('timestamp')
    .setDescription("Give a timestamp code")

    .addStringOption(option =>
        option.setName('date')
        .setDescription('the date in MM DD YYYY')
        .setRequired(true)
        )
    .addStringOption(option =>
        option.setName('time')
        .setDescription('the 24h time is in HH:MM<:SS>')
        .setRequired(true)
        )
    .addStringOption(option =>
        option.setName('time_region')
        .setDescription('PST/MST/CST/EST')
        .setRequired(true)
        .setMaxLength(4)
        .setMinLength(3)
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
        ))
    .addBooleanOption(option =>
        option.setName('silent')
        .setDescription('shhhhh (true)')
        )
    .addBooleanOption(option =>
        option.setName('mobile')
        .setDescription('set true for mobile copy/paste')
        ),

    async execute(interaction, client) {

        const date = interaction.options.getString('date');
        const time = interaction.options.getString('time');
        const region = interaction.options.getString('time_region').toLowerCase();
        const format = interaction.options.getString('format') || 'R';
        const silence = interaction.options.getBoolean('silent') || false;
        const mobile = interaction.options.getBoolean('mobile') || false;

        const response = timeStampCalc(date, time, region, format);
        

        if (silence) {    
            await interaction.reply({
                content: response[0],
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: response[0]
            });
        }

        if (mobile) {
            client.channels.send(response[1]);
            await interaction.reply({
                content: response[1],
                ephemeral: true
            });
        }
    }
}