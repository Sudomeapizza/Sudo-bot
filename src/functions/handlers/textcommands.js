module.exports = (client) => {
    
    // I ain't questioning it, but it WORKS
    client.on("messageCreate", async (message) => {
        if (message.author.bot) return false;
        //console.log("message created: " + message.content);
        //message.channel.send(`You said: ${message.content}`);
        
        // TODO: MAKE THIS DYNAMICALLY ADD MORE COMMANDS?
        // require()(client);

    })

    client.on("")

}