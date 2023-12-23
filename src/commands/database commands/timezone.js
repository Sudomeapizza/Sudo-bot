const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('settimezone')
    .setDescription("Set your timezone for auto converting messages.")
    .addStringOption((option) =>
        option.setName('timezone')
        .setDescription('The region to which you reside.')
        .setRequired(true)
        .addChoices(
            {name: "JST/Tokyo", value: "JST"},
            {name: "CST/Beijing", value: "CST"},
            {name: "WIB/Jakarta", value: "WIB"},
            {name: "BST/Dhaka", value: "BST"},
            {name: "UZT/Tashkent", value: "UZT"},
            {name: "GST/Dubai", value: "GST"},
            {name: "MSK/Moscow", value: "MSK"},
            {name: "EET/Cairo", value: "EET"},
            {name: "CET/Brussels", value: "CET"},
            {name: "GMT/London", value: "GMT"},
            {name: "CVT/Praia", value: "CVT"},
            {name: "CGT/Nuuk", value: "CGT"},
            {name: "ART/Buenos Aires", value: "ART"},
            {name: "VET/Caracas", value: "VET"},
            {name: "EST/New York", value: "EST"},
            {name: "CST/Mexico City", value: "CST"},
            {name: "MST/Calgary", value: "MST"},
            {name: "PST/Los Angeles", value: "PST"},
            {name: "HST/Honolulu", value: "HST"},
            {name: "NUT/Alofi", value: "NUT"},
            {name: "AoE/Baker Island", value: "AoE"},
            {name: "ANAT/Anadyr", value: "ANAT"},
            {name: "AEDT/Melbourne", value: "AEDT"},
            {name: "AEST/Brisbane", value: "AEST"},
            {name: "AKST/Anchorage", value: "AKST"},
        )
    ),
    async execute(interaction, client) {
        const user = interaction.user;
        var desiredTimeZone = interaction.options.getString('timezone');

        desiredTimeZone = await client.setTimeZone(interaction.member.id, interaction.guild.id, desiredTimeZone);
        var updatedTimeZone = await client.getTimeZone(interaction.member.id);
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

        // const timezone = await client.getTimeZone(user,timezone);
        
    }

}