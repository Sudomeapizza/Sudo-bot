const { timestampformat } = require('./timestampformat.js')

/**
 * Processes a given preset with provided arguments.
 * @param {string} presetName The name of the preset.
 * @param {string[]} argsArray An array of arguments for the preset.
 * @returns {string} The result of the preset calculation or an error message.
 */
function calcPresets(presetName, argsArray) {
    switch (presetName) {
        case 'Egg Contract': {
            var [url, req, timestamp] = argsArray;

            if (!url || !req || !timestamp) {
                return `Error: 'Egg Contract' requires a URL and a Timestamp. Usage: \`/presets "Egg Contract" <url> <timestamp>\``;
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

            return `Ecoopad ${coopIdContractName}\nAll welcome! <a:chicken_wobble:1340181821538828418> Required: ${req} by ${timestampformat("rT",timestamp,"f", true)}`;
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

