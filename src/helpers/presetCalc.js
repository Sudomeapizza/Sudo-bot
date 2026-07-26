const { timestampformat } = require('./timestampformat.js')
const fs = require('fs');
const path = require('path');

/**
 * Processes a given preset with provided arguments.
 * @param {string} presetName 
 * @param {string[]} argsArray 
 * @param {import('discord.js').Client} client 
 * @returns {Promise<string>} 
 */
async function calcPresets(presetName, argsArray, client) {
    switch (presetName) {
        case 'Egg Contract': {
            var [url, req, timestamp] = argsArray;

            if (!url || !req || !timestamp) {
                return `Error: 'Egg Contract' requires a URL and a Timestamp.`;
            }

            let coopIdContractName = '';
            try {
                url = new URL(url);
                // Split the pathname by '/' and filter out empty strings
                // Example: /quantum-compost/unicorn-compost -> ["", "quantum-compost", "unicorn-compost"]
                // Filtered: ["quantum-compost", "unicorn-compost"]
                const pathSegments = url.pathname.split('/').filter(segment => segment.length > 0);

                console.log("segments: " + pathSegments)
                if (pathSegments.length >= 2) {
                    // Take the last two segments
                    coopIdContractName = `${pathSegments[pathSegments.length - 2]} ${pathSegments[pathSegments.length - 1]}`;
                } else {
                    coopIdContractName = url; // Fallback if not enough segments
                }
            } catch (e) {
                // Handle invalid URL gracefully, use the raw input
                console.error("Invalid URL provided for Egg Contract:", e);
                coopIdContractName = url;
            }

            var tempMsg = `Ecoopad ${coopIdContractName}\n` +
                `All welcome! <a:chicken_wobble:1340181821538828418> \n` +
                `Required: ${req} by ${timestampformat("rT",timestamp,"f", true, true)}`;

                
            try {
                const filePath = path.join(__dirname, 'saved_urls.txt');
            
                // 1. Check if file exists
                if (fs.existsSync(filePath)) {
                    // 2. Read file content
                    const fileContent = fs.readFileSync(filePath, 'utf8');
                    

                    const parts = fileContent.split('/');
                    const guildId = parts[4];
                    const channelId = parts[5];
                    const messageId = parts[6];

                    if (!guildId || !channelId || !messageId) {
                        throw new Error('Invalid Discord URL format');
                    }

                    const channel = await client.channels.fetch(channelId);
                    if (!channel) {
                        throw new Error('Channel not found or bot lacks access');
                    }

                    const message = await channel.messages.fetch(messageId);
                    if (!message) {
                        throw new Error('Message not found or bot lacks access');
                    }

                    // 3. Append with two newlines
                    tempMsg += `\n\n${message.content}`;
                }
            } catch (err) {
                console.error("Error reading file:", err);
                // Optionally return error or just ignore
            }


            return tempMsg;
        }
        case 'Additional Egg Message': {
            const [url] = argsArray;

            if (!url) {
                return `Error: 'Url' requires a URL`;
            }

            try {
                const parts = url.split('/');
                const guildId = parts[4];
                const channelId = parts[5];
                const messageId = parts[6];

                if (!guildId || !channelId || !messageId) {
                    throw new Error('Invalid Discord URL format');
                }

                const channel = await client.channels.fetch(channelId);
                if (!channel) {
                    throw new Error('Channel not found or bot lacks access');
                }

                const message = await channel.messages.fetch(messageId);
                if (!message) {
                    throw new Error('Message not found or bot lacks access');
                }

                const content = message.content;
                
                const filePath = path.join(__dirname, 'saved_urls.txt');
                fs.appendFileSync(filePath, `${url}\n`);

                return `Message Content:\n\n${content}`;
            } catch (error) {
                return `Error fetching message: ${error.message}`;
            }
        }
        // case 'Rossmann': {
        //     const [url] = argsArray;
        //     if (url) {
        //         return `**Preset: Rossmann**\nURL: ${url}`;
        //     } else {
        //         return `Error: 'Rossmann' requires a URL. Usage: \`/presets Rossmann <url>\``;
        //     }
        // }
        // case 'Simple': {
        //     if (argsArray.length === 0) {
        //         return `**Preset: Simple**\nNo arguments provided.`;
        //     } else {
        //         return `**Preset: Simple**\nArguments: ${argsArray.join(', ')}`;
        //     }
        // }
        default:
            return `Unknown preset: '${presetName}'`;
    }
}

module.exports = { calcPresets };

