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
                { name: 'Global username:', value: `${target.globalName}` },
                { name: '\u200B', value: '\u200B' }, // spacer

                { name: 'Display Name:', value: `${target.displayName}`, inline: true },
                { name: 'Username:', value: `${target.username}`, inline: true },
                { name: 'User ID:', value: `${target.id}`, inline: true },

                { name: 'Discord Join Date:', value: `${target.createdAt}`/*, inline: true*/ },
                { name: 'Server Join Date:', value: `${interaction.guild.members.cache.get(target).joinedAt}`, inline: true },
                
                { name: 'Is Bot:', value: `${target.bot}`, inline: true },
                { name: 'Is System:', value: `${target.system}`, inline: true },
                { name: 'Server Join timestamp:', value: `${target.createdTimestamp}`, inline: true },
                { name: 'Banner URL:', value: `${target.bannerURL()}`, inline: true },
                { name: 'Avatar Decoration URL:', value: `${target.avatarDecorationURL()}`, inline: true },
                { name: 'Server Join Date:', value: `${target.createdAt}`, inline: true },
            )
            // .setImage()
            .setTimestamp()
            .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL(), url: client.user.displayAvatarURL() });

        console.log(target.flags.UserFlag);
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