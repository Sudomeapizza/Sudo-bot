module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`${client.user.tag} is online`)
        console.log(`yo`);
        client.channels.cache.get(`1178352991150014505`).send("Booted and ready!");
    }
}

// /\b(?:mon|tue|wed|thurs|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday|today|tonight)\b\s(?:at|@)\s((?:[0]\d|[01]\d|2[0-3]):?[0-5]\d)?/
// /\b(?:mon|tue|wed|thurs|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday|today|tonight)\b\s(?:at|@)\s((?:[0]\d|[01]?\d|2[0-3]):?[0-5]\d)?/
