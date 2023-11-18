module.exports = (client) => {
    
    // I ain't questioning it, but it WORKS
    client.on("messageCreate", async (message) => {
        if (message.author.bot) return false;
        //console.log("message created: " + message.content);
        //message.channel.send(`You said: ${message.content}`);
        
        // TODO: MAKE THIS DYNAMICALLY ADD MORE COMMANDS?
        // require()(client);

        if (message.author.id === '210932800000491520') {
            // if (Math.floor(Math.random() * 100) == 0) {
                if (message.content.contains("bloody")) {
                    message.channel.send(`${message.content}`);
                }
            // }
        }

    })
}