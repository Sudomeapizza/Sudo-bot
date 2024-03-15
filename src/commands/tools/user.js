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
        const targetAtServer = interaction.guild.members.cache.get(interaction.options.getUser('user').id);
        // console.log(target.createdAt);
        // console.log(target.createdTimestamp);

        var createdTimestamp = `<t:${target.createdTimestamp.toString().substring(0,10)}:F> <t:${target.createdTimestamp.toString().substring(0,10)}:R>`

        // console.log(target.joinedTimestamp);
        // console.log(interaction.guild.members.cache.get(interaction.options.getUser('user').id).nickname);
        var nicknameUser = ``;

        var joinedTimestamp, userRoles = "";
        
        try {
            joinedTimestamp = targetAtServer.joinedTimestamp;
            joinedTimestamp = `<t:${joinedTimestamp.toString().substring(0,10)}:F> <t:${joinedTimestamp.toString().substring(0,10)}:R>`;
            
            nicknameUser = targetAtServer.nickname || `None`;

            const roles = targetAtServer.roles.cache;
            console.log(`1: ${targetAtServer}`);
            console.log(`1: ${targetAtServer.roles}`);
            console.log(`1: ${roles}`);
            roles.forEach(role => {
                if (role.name != "@everyone") {
                    userRoles += `${role}${role.id}${role.name}, `;
                    console.log(`2: ${role.name}`);
                }
            });

            userRoles = userRoles.slice(0, -2);

        } catch (error) {
            // console.log(error);
            joinedTimestamp = `User not in this server`;
            nicknameUser = `N/A`;
            userRoles = "N/A";
        }

        // console.log(joinedTimestamp);

        // https://discordjs.guide/popular-topics/embeds.html#embed-preview
        const userEmbed = new EmbedBuilder()
            .setColor(0x8B41C8)
            .setDescription(`${target}`)
            .setThumbnail(target.displayAvatarURL())
            .addFields(
                // { name: '**__Global Username__**', value: `${target.globalName}`, inline: true },
                { name: '**__Nickname__**', value: `${nicknameUser}`, inline: true },
                { name: '**__Username__**', value: `@${target.username}`, inline: true },
                { name: '**__Display Name__**', value: `${target.displayName}`, inline: true },
                { name: '**__Is Bot__**', value: `${target.bot}`, inline: true },
                { name: '**__Is System__**', value: `${target.system}`, inline: true },
                { name: '**__User ID__**', value: `${target.id}`, inline: true },
                { name: '**__Discord Join Date__**', value: `${createdTimestamp}`},
                { name: '**__Server Join Date__**', value: `${joinedTimestamp}`},
                { name: '**__User Roles:__**', value: `${userRoles}`},
                // { name: '\u200B', value: '\u200B' }, // spacer
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