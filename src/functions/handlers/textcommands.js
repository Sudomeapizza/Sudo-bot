const { timeStampCalc, goToDate } = require('../../helpers/timestampcalc.js')
const { dateRegex } = require('../../helpers/regex.js');
const { getRegion } = require('../../helpers/user.js');

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
                // if (message.content.toLowerCase().includes("bloody")) {
                    // message.channel.send(`${message.content}`);
                // }
            // }
        }

        if (message.guildId === '1076645110390984714'
        || message.guildId === '351882915153707008') {
            var userMessage = message.content;
            const info = dateRegex(userMessage);
            if (info[0] != null) {
                message.channel.send(info[0] + " " + info[1]);
                const targetDate = goToDate(userMessage);
                var timestamp = timeStampCalc(targetDate, info[1], getRegion(message.author.id), 'R', true);
                
                message.channel.send(userMessage.replace(`${info[0]} at ${info[1]}`,timestamp));

            } else {
                message.channel.send(info[0]);
            }
        }



    })
}