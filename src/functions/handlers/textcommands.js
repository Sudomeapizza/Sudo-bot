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
            if (message.author.bot) {return;}
            var userMessage = message.content;
            const info = dateRegex(userMessage);
            if (info[0] != null) {
                // message.channel.send(info[0] + " " + info[1]);
                const targetDate = goToDate(userMessage);
                var timestamp = timeStampCalc(targetDate, info[0], getRegion(message.author.id), 'D', true);
                console.log("_" + timestamp);
                if (timestamp != false) {
                    message.channel.send(userMessage.replace(`${info[1]} at ${info[0]}`,`${timestamp[0]}${timestamp[1]}`));
                } else {
                    message.channel.send({content:"You do not have a region set internally, please specify your region.", ephemeral:true});
                }

            } else {
                message.channel.send(info[0]);
            }
        }



    })
}