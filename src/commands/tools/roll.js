const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription("Roll dice")
    .addStringOption(option =>
        option.setName('sides')
        .setDescription('How many sides. Default 20.')
        )
    .addStringOption(option =>
        option.setName('options')
        .setDescription('option1,option2...,optionX')
        )
    .addStringOption(option =>
        option.setName('silence')
        .setDescription('quiet')
        )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false),
    async execute(interaction, client) {
        const rollSize = interaction.options.getString('sides') || 20;
        const options = interaction.options.getString('options');
        const silence = interaction.options.getString('silence');

        console.log(`${rollSize}`);

        try {
            if (rollSize) {
                rollSize = Math.round(Math.random() * rollSize);

                // https://discordjs.guide/popular-topics/embeds.html#embed-preview
                const userEmbed = new EmbedBuilder()
                    .setColor(0x8B41C8)
                    .setAuthor({name: `${interaction.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
                    .setThumbnail("https://nc.sudomeapizza.com/apps/files_sharing/publicpreview/QaR94zarezADXkq?file=/&fileId=4248&x=1920&y=1080&a=true&etag=8a3330768469871f1083fe65a40ed338")
                    .addFields(
                        { name: '**Roll:**', value: `Invalid roll value`}
                    )
                    .setTimestamp()
                    .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL(), url: client.user.displayAvatarURL() });

                if (silence) {
                    const message = await interaction.reply({
                        embeds: [userEmbed],
                        ephemeral: true
                    });
                } else {
                    const message = await interaction.reply({
                        embeds: [userEmbed]
                    });
                }
            }
        } catch (error) {
            await interaction.reply({
                embeds: new EmbedBuilder()
                .setColor(0x8B41C8)
                .setAuthor({name: `${interaction.username}`, iconURL: `${interaction.user.displayAvatarURL()}`})
                .setThumbnail("https://nc.sudomeapizza.com/apps/files_sharing/publicpreview/QaR94zarezADXkq?file=/&fileId=4248&x=1920&y=1080&a=true&etag=8a3330768469871f1083fe65a40ed338")
                .addFields(
                    { name: '**Roll:**', value: `${rollSize} test`}
                )
                .setTimestamp()
                .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL(), url: client.user.displayAvatarURL() }),
                ephemeral: true
            });
        }
    }
}