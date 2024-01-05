const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription("Display help on what I can do!"),
    async execute(interaction, client) {
        const user = interaction.user;

        const message = "Get started with \`/settimezone\` to globally use your timezone to auto convert your messages\n" +
                        "Remove your data with \`/removetimezonedata\` at anytime!\n" +

                        "I can recognize any combination of these commands!\n" +
                        "<day> <at/@> <time>\n" +
                        "!(Date) <at/@> <time>\n" +

                        "Tuesday at 12:00am\n" +
                        "today at 15:00\n" +
                        "tomorrow at 5:00 pm\n" +
                        "Tuesday at 1200\n" +
                        "tonight @ 20\n" +
                        "!(Dec 14 2025) at 4pm\n" +
                        "!(Jan 10) at 15`";

        const embed = new EmbedBuilder()
            .setTitle(`Help:`)
            .setTimestamp()
            .setDescription(message)
            .setFooter({
                text: client.user.tag,
                iconURL: client.user.displayAvatarURL(),
            });
        await interaction.reply({
            embeds: [embed],
            ephemeral: true,
        })
    }
}