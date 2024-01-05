module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`${client.user.tag} is online`);
        client.channels.cache.get(`1178644165731557436`).send("Booted and ready!");
    }
}