const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js')

module.exports = {
    category: 'tools',
    data: new SlashCommandBuilder()
    .setName('say')
    .setDescription("SPEAK")
    .addStringOption(option =>
        option.setName('message')
        .setDescription('putty text here')
        .setRequired(true)
        )
    .addStringOption(option =>
        option.setName('replyid')
        .setDescription('Message ID to reply to')
        )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false),
    async execute(interaction, client) {
        const usermessage = interaction.options.getString('message');
        const replymessageid = interaction.options.getString('replyid');

        if (usermessage != ""){

            // if reply is entered
            if (replymessageid) {

                // attempt to pull message id
                const fetchedMessage = await interaction.channel.messages.fetch(replymessageid).catch(console.error);

                // if message found, reply to it
                if (fetchedMessage) {
                    await interaction.reply({
                        content: ".",
                        flags: silence ? MessageFlags.Ephemeral : undefined
                    });
                    await interaction.deleteReply({});
                    
                    await fetchedMessage.reply({
                        content: usermessage
                    });

                // if invalid message id
                } else {
                    await interaction.reply({
                        content: "message does not exist",
                        flags: silence ? MessageFlags.Ephemeral : undefined
                    });
                }

            // do a standard message send
            } else {
                client.channels.cache.get(`${interaction.channelId}`).send(usermessage);
                await interaction.reply({
                    content: ".",
                    flags: silence ? MessageFlags.Ephemeral : undefined
                });
                await interaction.deleteReply({});
            }
        }
    }
}