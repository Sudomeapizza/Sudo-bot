module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`${client.user.tag} is online`);
        // client.channels.cache.get(`1178644165731557436`).send("Booted and ready!");

        // Fetch the guild (server) by ID
        const guild = client.guilds.cache.get("1174218330962395146");

        // Fetch the channel by ID
        const channel = guild.channels.cache.get(`1178644165731557436`);

        // Send the message "Booted and ready!" to the specified channel
        channel.send('Booted and ready!');
    }
}