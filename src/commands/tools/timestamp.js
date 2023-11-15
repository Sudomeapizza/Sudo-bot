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
        .setDescription('the time in HH:MM<:SS>')
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
        )),


    async execute(interaction, client) {

        const date = interaction.options.getString('date');
        const time = interaction.options.getString('time');
        const region = interaction.options.getString('time_region');
        const format = interaction.options.getString('format');


        var timestamp = Date.parse(`${date} ${time}`);
        
        // hour change by 3,600,000
        const change = 3600000;

        switch (region) {
            case "PST":
                // lol does nothing since server is located here
                break;
            case "PST":
                timestamp += change * 1;
                break;
            case "PST":
                timestamp += change * 2;
                break;
            case "PST":
                timestamp += change * 3;
                break;
            default:
                break;
        }

        const fullResponse = `Timestamp code: \`<t:${timestamp}:${format}>\`\n`
        + `How it appears: <t:${timestamp}:${format}>`;
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