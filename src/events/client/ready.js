const { MessageFlags } = require('discord.js')


module.exports = {
    name: 'clientReady',
    once: true,
    async execute(client) {
        console.log(`${client.user.tag} is online`);
        client.channels.cache.get(`1178352991150014505`).send({
            content: "Booted and ready!",
            flags: MessageFlags.SuppressNotifications
        });
    }
}