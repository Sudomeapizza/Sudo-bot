module.exports = (client) => {
    client.on('voiceStateUpdate', async (oldState, newState) => {
    // client.on('voiceStateUpdate', (oldUser, newUser) => {
        console.log(`voiceStateUpdate: ${oldState} | ${newState}`);
    });
}