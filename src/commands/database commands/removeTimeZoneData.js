const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('removeTimeZoneData')
    .setDescription("Clear Timezone Data with you"),
    async execute(interaction, client) {
        const user = interaction.user;

        success = await client.removeTimeZoneData(interaction.member.id);

        if (success) {
            const embed = new EmbedBuilder()
                .setTitle(`You have updated your time region to:`)
                .setTimestamp()
                .addFields([
                    {
                        name: `${updatedTimeZone.timeZone}`,
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
        } else {
            const embed = new EmbedBuilder()
                .setTitle(`You have removed all timezone data`)
                .setTimestamp()
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

}