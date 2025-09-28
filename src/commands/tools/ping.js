const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType, MessageFlags } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription("return the pinnng")
    .addBooleanOption(option =>
        option.setName('silents')
        .setDescription('shhhhh (true)')
        )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setContexts(InteractionContextType.BotDM,InteractionContextType.PrivateChannel,InteractionContextType.Guild),
    async execute(interaction, client) {

        const silence = interaction.options.getBoolean('silents') || false;
        console.log("Silent ping: " + silence);

        await interaction.deferReply({
            withResponse: true,
            flags: silence ? MessageFlags.Ephemeral : undefined
        });

        const message = await interaction.fetchReply();
        const ping = client.ws.ping;

        const newMessage = `Pong: ${ping}ms`;

        await interaction.editReply({
            content: newMessage,
        });
    }
}