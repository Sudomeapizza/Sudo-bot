const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

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
                .setDescription('true / false')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .setDMPermission(false),
    async execute(interaction, client) {
        let rollSize = parseInt(interaction.options.getString('sides')) || 20;
        const optionsString = interaction.options.getString('options');
        const silence = interaction.options.getString('silence') || false;

        const options = optionsString ? optionsString.split(',') : [];

        console.log(options);
        console.log(options.length);
        try {
            if (!isNaN(rollSize) && rollSize > 0) {
                const rollResult = Math.floor(Math.random() * rollSize) + 1;
                console.log(`roll: ${rollResult}`);
                let result = "";

                if (options.length > 0) {
                    console.log(`greater than 0: ${options.length}`);

                    if (rollResult <= options.length - 1) {
                        result = `${options[rollResult]}`
                    }

                    result = `Option ${rollResult + 1}`;
                } else {
                    console.log(`equal to zero 0: ${options.length}`);
                    result = rollResult + 1;
                }

                await interaction.reply({
                    embeds: [new EmbedBuilder()
                        .setColor(0x8B41C8)
                        .setAuthor({ name: `${interaction.user.displayName}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                        .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/c/cd/D20_icon_showing_1.png")
                        .addFields(
                            { name: '**Roll:**', value: result }
                        )
                        .setTimestamp()
                        .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() })
                    ],
                    ephemeral: silence
                });
            } else {
                throw new Error('Invalid roll value');
            }
        } catch (error) {
            await interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor(0x8B41C8)
                    .setAuthor({ name: `${interaction.user.displayName}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                    .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/c/cd/D20_icon_showing_1.png")
                    .addFields(
                        { name: '**Roll:**', value: `Invalid roll value` }
                    )
                    .setTimestamp()
                    .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() })
                ],
                ephemeral: true
            });
        }
    }
};
