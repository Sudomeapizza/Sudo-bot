const { SlashCommandBuilder } = require('discord.js')
const { timeStampCalc } = require('../../helpers/timestampcalc.js')
const { goToDate } = require('../../helpers/timestampcalc.js');

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
        .setDescription('Time Region code. Ex: UTC. (Optional if already setup with bot, otherwise required)')
        // .setRequired(true) // somehow make optional based on DB?
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
        var region = await client.getTimeZone(interaction.member.id);
        console.log(region.timeZone);

        if (interaction.options.getString('time_region') == null ) {
            if (region == null) {
                region = false;
            }
        }

        var date = interaction.options.getString('date');
        const time = interaction.options.getString('time');
        const format = interaction.options.getString('format') || 'R';
        const silence = interaction.options.getBoolean('silent') || false;
        const mobile = interaction.options.getBoolean('mobile') || false;
        const targetDate = goToDate(date);

        const response = timeStampCalc(targetDate, time, region, format);

        if (response == false) {

            await interaction.reply({
                content: "You do not have a region set internally, please specify your region.",
                ephemeral: true
            });
        } else {
        
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
                client.channels.send(response[1] || "None6");
                await interaction.reply({
                    content: response[1],
                    ephemeral: true
                });
            }
        }
    }
}