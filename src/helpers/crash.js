const { MessageFlags } = require('discord.js');
const { timestampformat } = require('./timestampformat');

function reportCrash(client, failedAction, info, error) {


    // crash log channel => https://discord.com/channels/1174218330962395146/1421832957743730810
    client.channels.cache.get(`1421832957743730810`).send({
        content: `${failedAction}: ${timestampformat("rT", "now", "F", true)}\n\nInfo:\n${JSON.stringify(info)}\n\nError:\n \`\`\`cr\n${((error && error.stack) ? error.stack : error.toString())}`.toString().substring(0, 1018)+"\n```",
        flags: MessageFlags.SuppressNotifications
    });
}

module.exports = { reportCrash };
