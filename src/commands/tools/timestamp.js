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
        .addChoices(
            {name: "JST/Tokyo", value: "JST"},
            {name: "HKT/Hong Kong Time", value: "HKT"},
            {name: "WIB/Jakarta", value: "WIB"},
            {name: "BST/Dhaka", value: "BST"},
            {name: "UZT/Tashkent", value: "UZT"},
            {name: "GST/Dubai", value: "GST"},
            {name: "MSK/Moscow", value: "MSK"},
            {name: "EET/Cairo", value: "EET"},
            {name: "CET/Brussels", value: "CET"},
            {name: "GMT/London", value: "GMT"},
            {name: "CVT/Praia", value: "CVT"},
            {name: "CGT/Nuuk", value: "CGT"},
            {name: "ART/Buenos Aires", value: "ART"},
            {name: "VET/Caracas", value: "VET"},
            {name: "EST/New York", value: "EST"},
            {name: "CST/Mexico City", value: "CST"},
            {name: "MST/Calgary", value: "MST"},
            {name: "PST/Los Angeles", value: "PST"},
            {name: "HST/Honolulu", value: "HST"},
            {name: "NUT/Alofi", value: "NUT"},
            {name: "AoE/Baker Island", value: "AoE"},
            {name: "ANAT/Anadyr", value: "ANAT"},
            {name: "AEDT/Melbourne", value: "AEDT"},
            {name: "AEST/Brisbane", value: "AEST"},
            {name: "AKST/Anchorage", value: "AKST"},
        )
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
        var region;
        
        if (interaction.options.getString('time_region') == null ) {
            region = await client.getTimeZone(interaction.member.id);
        } else {
            region = interaction.options.getString('time_region');
        }

        console.log("0" + region.timeZone);
        
        var date = interaction.options.getString('date');
        const time = interaction.options.getString('time');
        // const timeRegion = interaction.options.getString('time_region') || false;
        const format = interaction.options.getString('format') || 'R';
        const silence = interaction.options.getBoolean('silent') || false;
        const mobile = interaction.options.getBoolean('mobile') || false;
        
        console.log("1 " + date);
        console.log("2 " + region);

        const response = timeStampCalc(goToDate(new Date(date).toLocaleDateString("en-US", { weekday: 'short' })), time, region, format);

        console.log("3 " + response);
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