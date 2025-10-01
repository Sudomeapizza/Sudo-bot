const { SlashCommandBuilder, InteractionContextType, MessageFlags } = require('discord.js')
// const { timestampformat } = require('../../helpers/timestampformat.js')

module.exports = {
    category: 'tools',
    data: new SlashCommandBuilder()
        .setName('testcmd')
        .setDescription("create discord timestamp")
        .addStringOption(option =>
            option.setName('input')
                .setDescription('type of time')
        )
        .addBooleanOption(option =>
            option.setName('silent')
                .setDescription('Invisible reply (Default=True)')
        )
        .setContexts(
            InteractionContextType.BotDM,
            InteractionContextType.PrivateChannel,
            InteractionContextType.Guild
        ),

    async execute(interaction, client) {
        const input = interaction.options.getString('input');
        // const rTime = interaction.options.getString('relativetime');
        // const fTime = interaction.options.getString('fixedtime');
        // const format = interaction.options.getString('format') ?? 'yes';
        // const outputType = interaction.options.getBoolean('displaytimecode') ?? true;
        const silent = interaction.options.getBoolean('silent') ?? true

        await interaction.deferReply({
            withResponse: true,
            flags: silent ? MessageFlags.Ephemeral : undefined
        });

        await interaction.editReply({
            content: `Polo: ${input}`,
        });
    }
}