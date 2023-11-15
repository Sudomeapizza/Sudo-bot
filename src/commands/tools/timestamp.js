const { SlashCommandBuilder } = require('discord.js')

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
    .addStringOption(option =>
        option.setName('silent')
        .setDescription('shhhhh (true)')
        ),

    async execute(interaction, client) {

        const date = interaction.options.getString('date');
        const time = interaction.options.getString('time');
        const region = interaction.options.getString('time_region');
        const format = interaction.options.getString('format') || 'R';
        const silence = interaction.options.getString('silent') || 'false';

        // this is in UTC
        var timestamp = Date.parse(`${date} ${time}`)/1000;
        
        // hour change by 3,600,000
        const change = 3600;

        switch (region) {
            case "PST":
                timestamp += change * 8;
                break;
            case "MST":
                timestamp += change * 9;
                break;
            case "CST":
                timestamp += change * 10;
                break;
            case "EST":
                timestamp += change * 11;
                break;
            default:
                // shrug
                break;
        }

        const fullResponse = `Timestamp code: \`<t:${timestamp}:${format}>\`\n`
        + `How it appears: <t:${timestamp}:${format}>`;

        if (silence) {    
            const message = await interaction.reply({
                content: fullResponse,
                ephemeral: true
            });
        } else {
            const message = await interaction.reply({
                content: fullResponse
            });
        }
    }
}