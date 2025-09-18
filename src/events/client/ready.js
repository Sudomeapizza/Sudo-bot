const { MessageFlags } = require('discord.js')


module.exports = {
    name: 'clientReady',
    once: true,
    async execute(client) {
        console.log(`${client.user.tag} is online`);
        client.channels.cache.get(`1178644165731557436`).send({
            content: "Booted and ready!",
            flags: MessageFlags.SuppressNotifications
        });
    }
}
