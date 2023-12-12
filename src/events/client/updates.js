module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState) {
    // client.on('voiceStateUpdate', (oldUser, newUser) => {
        console.log(`voiceStateUpdate: ${oldState} | ${newState}`);
    }
}
console.log("yo dawg, heard you hate this");