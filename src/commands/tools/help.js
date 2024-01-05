const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription("Display help on what I can do!"),
    async execute(interaction, client) {
        const user = interaction.user;

        const message = `Get started with \`/settimezone\` to globally use your timezone to auto convert your messages\n
                        Remove your data with \`/removetimezonedata\` at anytime!

                        I can recognize any combination of these commands!
                        <day> <at/@> <time>
                        !(Date) <at/@> <time>

                        Tuesday at 12:00am
                        today at 15:00
                        tomorrow at 5:00 pm
                        Tuesday at 1200
                        tonight @ 20
                        !(Dec 14 2025) at 4pm
                        !(Jan 10) at 15`;

        const embed = new EmbedBuilder()
            .setTitle(`Help:`)
            .setTimestamp()
            .addFields([
                {
                    name: message,
                    value: `\u200b`,
                },
            ])
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