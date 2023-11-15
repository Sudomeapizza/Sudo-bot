const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('user')
    .setDescription("give deets")
    .addUserOption(option =>
        option.setName('user')
        .setDescription('username')
        )
    .addBooleanOption(option =>
        option.setName('silent')
        .setDescription('shhhhh (true)')
        ),

    async execute(interaction, client) {

        const target = interaction.options.getUser('user');
        const silence = interaction.options.getString('silent') || false;
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
                ephemeral: true
            });
        } else {
            const message = await interaction.reply({
                content: newMessage
            });
        }
    }
}