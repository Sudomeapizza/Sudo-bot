const { SlashCommandBuilder, InteractionContextType, MessageFlags } = require('discord.js')
const { calcPresets } = require('../../helpers/presetCalc.js')
const presetsData = require('../../helpers/minicmds.json')
const { doMath } = require('../../helpers/math.js')
const presets = presetsData.minicmds;

// console.log('Loaded Presets:', presets);

module.exports = {
    catagory: "tools",
    data: new SlashCommandBuilder()
        .setName('minicmds')
        .setDescription("assorted commands")
        .addStringOption(option =>
            option.setName('minicmd')
                .setDescription('select minicmds')
                .setAutocomplete(true)
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('args')
                .setDescription('arguments')
        )
        .addBooleanOption(option =>
            option.setName('silent')
                .setDescription('Invisible reply (Default=True)')
        )
        .setContexts(
            InteractionContextType.BotDM,
            InteractionContextType.PrivateChannel,
            InteractionContextType.Guild
        ),

    async autocomplete(interaction) {
        const focusedOption = interaction.options.getFocused(true);
        let choices = [];

        if (focusedOption.name === 'minicmd') {
            const presetNames = Object.keys(presets);
            let relevantPresets;

            if (!focusedOption.value) {
                // If no text is entered, show the first 25 presets
                relevantPresets = presetNames; // Take all for mapping, then slice later
            } else {
                // Otherwise, filter based on the user's input
                relevantPresets = presetNames.filter(choice =>
                    choice.toLowerCase().startsWith(focusedOption.value.toLowerCase())
                );
            }

            choices = relevantPresets.map(presetName => {
                const presetArgs = presets[presetName];
                const argNames = Object.keys(presetArgs);
                let argHint = '';

                if (argNames.length > 0) {
                    const hints = argNames.map(argKey => {
                        const argDesc = presetArgs[argKey].description || argKey;
                        return `<${argDesc}>`;
                    });
                    argHint = ` - Args: ${hints.join(' ')}`;
                }

                return {
                    name: `${presetName}${argHint}`,
                    value: presetName
                };
            });
        }

        console.log('Autocomplete choices:', choices); // Add this
        await interaction.respond(
            choices.slice(0, 25) // Always slice to 25 to adhere to Discord's limit
        );
    },

    async execute(interaction, client) {
        const minicmd = interaction.options.getString('minicmd');
        const argsString = interaction.options.getString('args');
        const silent = interaction.options.getBoolean('silent') ?? true;

        await interaction.deferReply({
            flags: silent ? MessageFlags.Ephemeral : undefined
        });



        const selectedPresetDefinition = presets[minicmd];
        let parsedArgs = [];

        if (argsString) {
            parsedArgs = argsString.split(/\s+/).map(arg => arg.trim()).filter(arg => arg.length > 0);
        }

        // Basic validation example
        let validationError = null;
        if (selectedPresetDefinition && Object.keys(selectedPresetDefinition).length > 0) {
            const expectedArgCount = Object.keys(selectedPresetDefinition).length;
            if (parsedArgs.length < expectedArgCount) {
                const missingArgs = Object.keys(selectedPresetDefinition)
                    .slice(parsedArgs.length)
                    .map(key => `<${selectedPresetDefinition[key].description || key}>`)
                    .join(' ');
                validationError = `Missing arguments for '${minicmd}'. Expected: ${missingArgs}`;
            }
        }

        if (validationError) {
            await interaction.editReply({
                content: `Error: ${validationError}`,
            });
            return;
        }

        const result = calcMinicmds(client, minicmd, argsString, parsedArgs);


        console.log(`result: ${result}`)
        await interaction.editReply({
            content: result.toString(),
        });
    }
}


function calcMinicmds(client, presetName, argsString, parsedArgs) {
    switch (presetName) {
        case "lmgtfy":
            return `https://letmegooglethat.com/?q=${encodeURIComponent(argsString)}`
            break;
        case "insult":
            return "Insults TBD..."
            break;
        case "sarcastic":
            var result = "";
            var flip = true;
            argsString[0].forEach(e => {
                if (e.match("[a-zA-Z]")) {
                    if (flip)
                        result += e.toUpperCase
                    else
                        result += e.toLowerCase
                    flip = !flip
                } else {
                    result += e
                }
            });
            return result
            break;
        case "shout":
            var result = "";
            argsString[0].forEach(e => {
                if (e.match("[a-zA-Z0-9]"))
                    result += `:regional_indicator_${e}:`
                else
                    result += e
            });
            return result
            break;
        case "calc":
            console.log(`Args: ${argsString}`)
            return doMath(argsString);
            break;
        default:
            break;
    }
}