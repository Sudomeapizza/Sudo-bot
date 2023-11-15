const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('user')
    .setDescription("give deets")
    .addUserOption(option =>
        option.setName('user')
        .setDescription('username')
        )
    .addStringOption(option =>
        option.setName('silent')
        .setDescription('shhhhh (true/false)')
        ),

    async execute(interaction, client) {

        const target = interaction.options.getUser('user');
        const silence = interaction.options.getString('silent');
        var newMessage = "";
        
        if (!target) {
            newMessage = `Display name: ${interaction.user.displayName}\n`
            + `Username: ${interaction.user.username}\n`
            + `User ID: ${interaction.user.id}`;
        } else {
            newMessage = `Display name: ${target.displayName}\n`
            + `Username: ${target.username}\n`
            + `User ID: ${target.id}`;
        }

        if (silence) {
            const message = await interaction.reply({
                content: newMessage,
                fetchReply: true,
                ephemeral: true
            });
        } else {
            const message = await interaction.reply({
                content: newMessage,
                fetchReply: true
            });
        }
    }
}