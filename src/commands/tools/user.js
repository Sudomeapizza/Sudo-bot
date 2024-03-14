const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('user')
    .setDescription("give deets")
    .addUserOption(option =>
        option.setName('user')
        .setRequired(true)
        .setDescription('username')
        )
    .addBooleanOption(option =>
        option.setName('silent')
        .setDescription('shhhhh (true)')
        )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
    async execute(interaction, client) {

        const target = interaction.options.getUser('user');
        const silence = interaction.options.getBoolean('silent') || false;
        var newMessage = "";
        
        // if (!target) {
        //     newMessage = `Display name: ${interaction.user.displayName}\n`
        //     + `Username: ${interaction.user.username}\n`
        //     + `User ID: ${interaction.user.id}`;
        // } else {
            newMessage = `Display name: ${target.displayName}\n`
            + `Username: ${target.username}\n`
            + `User ID: ${target.id}`;
        // }

        // https://discordjs.guide/popular-topics/embeds.html#embed-preview

        const userEmbed = new EmbedBuilder()
            .setColor(0x8B41C8)
            .setThumbnail(target.displayAvatarURL())
            .addFields(
                { name: 'Display Name:', value: `${target.displayName}`, inline: true },
                // { name: '\u200B', value: '\u200B' }, // spacer
                { name: 'Username:', value: `${target.username}`, inline: true },
                { name: 'User ID:', value: `${target.id}`, inline: true },
                { name: 'Discord Join Date:', value: `hmmm`, inline: true },
                { name: 'Server Join Date:', value: `Great Question`, inline: true },
            )
            .addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
            // .setImage()
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
}