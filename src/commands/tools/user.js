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

        // console.log(interaction.guild.members.cache.get(target.id));
        // console.log(interaction.guild.members.cache);
        // console.log(interaction.member);
        // console.log(interaction.member.guild);
        // console.log(interaction.member.joinedAt);
        // console.log(interaction.member.joinedTimestamp);
        // console.log(interaction.member.joinedTimestamp.toString().substring(0,10));
        console.log(target.createdAt);
        console.log(target.createdTimestamp);

        const userEmbed = new EmbedBuilder()
            .setColor(0x8B41C8)
            .setThumbnail(target.displayAvatarURL())
            .addFields(
                { name: '**__Global username__**', value: `${target.globalName}`, inline: true },
                { name: '**__Username__**', value: `${target.username}`, inline: false },
                // { name: '\u200B', value: '\u200B' }, // spacer

                { name: '**__Display Name__**', value: `${target.displayName}`, inline: true },
                { name: '**__User ID__**', value: `${target.id}`, inline: true },

                { name: '**__Discord Join Date__**', value: `<t:${target.createdTimestamp.toString().substring(0,10)}:F> <t:${target.createdTimestamp.toString().substring(0,10)}:R>`},
                { name: '**__Server Join Date__**', value: `<t:${interaction.member.joinedTimestamp.toString().substring(0,10)}:F> <t:${interaction.member.joinedTimestamp.toString().substring(0,10)}:R>`},

                { name: '\u200B', value: '\u200B' }, // spacer

                { name: '**__Is Bot__**', value: `${target.bot}`, inline: true },
                { name: '**__Is System__**', value: `${target.system}`, inline: true },
            )
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