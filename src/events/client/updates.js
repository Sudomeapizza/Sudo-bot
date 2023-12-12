module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
    // client.on('voiceStateUpdate', (oldUser, newUser) => {
        console.log(`voiceStateUpdate: ${oldState} | ${newState}`);
    }
}