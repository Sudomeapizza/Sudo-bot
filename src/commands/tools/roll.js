const { SlashCommandBuilder, EmbedBuilder, MessageFlags, InteractionContextType } = require('discord.js');

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
        .setContexts(
            InteractionContextType.BotDM,
            InteractionContextType.PrivateChannel,
            InteractionContextType.Guild
        ),
    async execute(interaction, client) {
        let rollSize = parseInt(interaction.options.getString('sides')) || 20;
        const optionsString = interaction.options.getString('options');
        const silence = interaction.options.getString('silence') || false;

        const options = optionsString ? optionsString.split(',') : [];

        try {
            if (!isNaN(rollSize) && rollSize > 0) {
                const rollResult = Math.floor(Math.random() * rollSize) + 1;
                console.log(`roll: ${rollResult}`);
                let result = "";

                if (options.length > 0) {
                    console.log(`options length: ${options.length}`);
                    if (rollResult <= options.length) {
                        result = `${options[rollResult - 1]}`;
                    } else {
                        result = `Option ${rollResult}`;
                    }
                } else {
                    console.log(`options length is zero: ${options.length}`);
                    result = rollResult.toString();
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
                    flags: silence ? MessageFlags.Ephemeral : undefined
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
                flags: silence ? MessageFlags.Ephemeral : undefined
            });
        }
    }
};
