const { SlashCommandBuilder, InteractionContextType, MessageFlags, Integration } = require('discord.js')
const { timestampformat } = require('../../helpers/timestampformat.js')

module.exports = {
    category: 'tools',
    data: new SlashCommandBuilder()
        .setName('timestamp')
        .setDescription("create discord timestamp")
        .addStringOption(option =>
            option.setName('type')
                .setDescription('type of time')
                .setRequired(true)
                .addChoices(
                    { name: 'Relative Time', value: "rT" },
                    { name: 'Fixed Time', value: "fT" },
                )
        )
        .addStringOption(option =>
            option.setName('relativetime')
                .setDescription('Relative time - use y/M/w/d/h/m/s and "-" for the past - ex: 5M3d22m, 90m, -5w1d')
        )
        .addStringOption(option =>
            option.setName('format')
                .setDescription('Show Time formats (Default=All)')
                .addChoices(
                    { name: 'All', value: 'yes' },
                    { name: 'Relative Time', value: 'R' },
                    { name: 'Long Date', value: 'D' },
                    { name: 'Short Date', value: 'd' },
                    { name: 'Lone Time', value: 'T' },
                    { name: 'Short Time', value: 't' },
                    { name: 'Long Time/Date', value: 'F' },
                    { name: 'Short Time/Date', value: 'f' },
                    { name: 'Countdown', value: "c" },
                )
        )
        .addStringOption(option =>
            option.setName('fixedtime')
                .setDescription('Enter a date - Date Req, Time Optional, Default UTC - Ex: "Sept 28 2025 9:10:25 UTC-7"')
        )
        .addBooleanOption(option =>
            option.setName('displaytimecode')
                .setDescription('Show time code in output (Default=True)')
        )
        .addBooleanOption(option =>
            option.setName('silent')
                .setDescription('Invisible reply (Default=True)')
        )
        .setContexts([
            InteractionContextType.Guild,
            InteractionContextType.BotDM,
            InteractionContextType.PrivateChannel,
        ]),

    async execute(interaction, client) {
        const timeType = interaction.options.getString('type');
        const rTime = interaction.options.getString('relativetime');
        const fTime = interaction.options.getString('fixedtime');
        const format = interaction.options.getString('format') ?? 'yes';
        const outputType = interaction.options.getBoolean('displaytimecode') ?? true;
        const silent = interaction.options.getBoolean('silent') ?? true

        await interaction.deferReply({
            withResponse: true,
            flags: silent ? MessageFlags.Ephemeral : undefined
        });

        if (!rTime || fTime) {
            await interaction.editReply({
                content: `Missing time input. Please use \"${timeType === "rT" ? "relativetime" : "fixedtime"}\" input`,
            });
        } else if (timeType === "rT") {
            await interaction.editReply({
                content: timestampformat(timeType, rTime, format, outputType ? false : true),
            });
        } else if (timeType === "fT") {
            await interaction.editReply({
                content: timestampformat(timeType, fTime, format, outputType ? false : true),
            });
        }
    }
}