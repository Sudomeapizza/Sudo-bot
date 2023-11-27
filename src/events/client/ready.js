module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`${client.user.tag} is online`)
        console.log(`yo`);
        client.channels.cache.get(`1178352991150014505`).send("Booted and ready!");
    }
}
