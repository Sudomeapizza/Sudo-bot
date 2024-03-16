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
        
        /**
         * @target The user from the scope of Discord globaly
         */
        const target = interaction.options.getUser('user');

        /**
         * @silence If the excecutor of the command wants the output to be ephemeral/silent
         */
        const silence = interaction.options.getBoolean('silent') || false;

        /**
         * @targetAtServer Takes the target user from the scope of the guild 
         */
        const targetAtServer = interaction.guild.members.cache.get(interaction.options.getUser('user').id);

        /**
         * @createdTimestamp The user's account creation timestamp from the scope of Discord globaly
         */
        var createdTimestamp = `<t:${target.createdTimestamp.toString().substring(0,10)}:F> <t:${target.createdTimestamp.toString().substring(0,10)}:R>`

        /**
         * @joinedTimestamp The user's join timestamp creation timestamp from the scope of the server excecuted from
         */
        var joinedTimestamp = "";

        /**
         * @userRoles The user's roles from the scope of the server excecuted from
         */
        var userRoles = "";

        /**
         * @nicknameUser The user's nickname from the scope of the server excecuted from
         */
        var nicknameUser = "";

        /**
         * @userDetails Dynamic Amalgamation of deets of user if present
         */
        var userDetails = "";

        try {
            joinedTimestamp = targetAtServer.joinedTimestamp;
            joinedTimestamp = `<t:${joinedTimestamp.toString().substring(0,10)}:F> <t:${joinedTimestamp.toString().substring(0,10)}:R>`;
            
            nicknameUser = targetAtServer.nickname || `None`;

            const roles = targetAtServer.roles.cache;

            roles.forEach(role => {
                if (role.name != "@everyone") {
                    userRoles += `${role}\n`;
                }
            });

        } catch (error) {
            console.log(error);
            joinedTimestamp = `Not in ${interaction.guild}`;
            nicknameUser = `Not in ${interaction.guild}`;
            userRoles = `Not in ${interaction.guild}`;
        }

        userDetails += `**__Global Username:__** ${target.globalName}\n`;
        userDetails += `**__Username:__** ${target.username}\n`; // try targetAtServer.username?
        userDetails += `**__Display Name:__** ${target.displayName}\n`;
        userDetails += `**__Nickname:__** ${nicknameUser}\n`;
        userDetails += `**__User ID:__** ${target.id}\n`;
        userDetails += `**__Is Bot:__** ${target.bot}\n`;
        userDetails += `**__Is System:__** ${target.system}`;


        // console.log(joinedTimestamp);

        // https://discordjs.guide/popular-topics/embeds.html#embed-preview
        const userEmbed = new EmbedBuilder()
            .setColor(0x8B41C8)
            .setAuthor({name: `${target.username}`, iconURL: `${target.displayAvatarURL()}`, url: `${target.displayAvatarURL()}`})
            .setDescription(`${target}`)
            .setThumbnail(target.displayAvatarURL())
            .addFields(
                // // { name: '**__Global Username__**', value: `${target.globalName}`, inline: true },
                // { name: '**__Nickname__**', value: `${nicknameUser}`, inline: true },
                // { name: '**__Username__**', value: `@${target.username}`, inline: true },
                // { name: '**__Display Name__**', value: `${target.displayName}`, inline: true },
                // { name: '**__User ID__**', value: `${target.id}`, inline: true },
                // { name: '**__Is Bot__**', value: `${target.bot}`, inline: true },
                // { name: '**__Is System__**', value: `${target.system}`, inline: true },
                // { name: '**__Discord Join Date__**', value: `${createdTimestamp}`},
                // { name: '**__Server Join Date__**', value: `${joinedTimestamp}`},
                // { name: '**__User Roles:__**', value: `${userRoles || `None`}`},
                // // { name: '\u200B', value: '\u200B' }, // spacer
                { name: '**__User Info__**', value: `${userDetails}`},
                { name: '**__Discord Join Date__**', value: `${createdTimestamp}`},
                { name: '**__Server Join Date__**', value: `${joinedTimestamp}`},
                { name: '**__User Roles:__**', value: `${userRoles || `None`}`},
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