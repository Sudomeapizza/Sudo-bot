const { SlashCommandBuilder, InteractionContextType, MessageFlags } = require('discord.js')
const { calcPresets } = require('../../helpers/presetCalc.js')
const presetsData = require('../../helpers/minicmds.json')
const {links} = require('../../helpers/noulinks.json')
const { doMath } = require('../../helpers/math.js');
const e = require('express');
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
                .setDescription('Invisible reply (Default False)')
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
                    argHint = ` - ${hints.join(' ')}`;
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
        const silent = interaction.options.getBoolean('silent') ?? false;

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

        // console.log(`Args: ${argsString}`)

        var result = calcMinicmds(client, minicmd, argsString, parsedArgs);

        result = result.substring(0,1990)

        console.log(`result: ${result}`)
        await interaction.editReply({
            content: result.toString() || "meow",
        });
    }
}


function calcMinicmds(client, presetName, argsString, parsedArgs) {
    switch (presetName) {
        case "lmgtfy":
            // console.log(`https://letmegooglethat.com/?q=${encodeURIComponent(argsString)}`)
            return `https://letmegooglethat.com/?q=${encodeURIComponent(argsString)}`
            break;
        case "insult":
            return "Insults TBD..."
            break;
        case "sarcastic":
            var result = "";
            var flip = true;
            for (const e of argsString) {
                if (e.match("[a-zA-Z]")) {
                    if (flip) {
                        result += e.toUpperCase()
                        // console.log(`Uppercase: ${e.toUpperCase()}`)
                    } else {
                        result += e.toLowerCase()
                        // console.log(`Lowercase: ${e.toLowerCase()}`)
                    }
                    flip = !flip
                } else {
                    result += e
                    // console.log(`No Flip:   ${e.toUpperCase()}`)
                }
            }
            return result
            break;
        case "shout":
            var result = "";
            for (const e of argsString) {
                if (e.match("[a-zA-Z]"))
                    result += `:regional_indicator_${e.toLowerCase()}:`
                else if (e.match("0")) 
                    result += `:zero:`
                else if (e.match("1")) 
                    result += `:one:`
                else if (e.match("2")) 
                    result += `:two:`
                else if (e.match("3")) 
                    result += `:three:`
                else if (e.match("4")) 
                    result += `:four:`
                else if (e.match("5")) 
                    result += `:five:`
                else if (e.match("6")) 
                    result += `:six:`
                else if (e.match("7")) 
                    result += `:seven:`
                else if (e.match("8")) 
                    result += `:eight:`
                else if (e.match("9")) 
                    result += `:nine:`
                else if (e.match("[#]")) 
                    result += `:hash:`
                else if (e.match("[*]")) 
                    result += `:asterisk:`
                else if (e.match("[+]")) 
                    result += `:heavy_plus_sign:`
                else if (e.match("[-]")) 
                    result += `:heavy_minus_sign:`
                else if (e.match("[/]")) 
                    result += `:heavy_division_sign:`
                else if (e.match("[=]")) 
                    result += `:heavy_equals_sign:`
                else if (e.match("[!]")) 
                    result += `:exclimation:`
                else if (e.match("[?]")) 
                    result += `:question:`
                else if (e.match("[$]")) 
                    result += `:heavy_dollar_sign:`
                else
                    result += e
            }
            return result
            break;
        case "calc":
            console.log(`Args: ${argsString}`)
            return doMath(argsString);
            break;
        case "nou":
            console.log(`Args: ${argsString}`)
            return links[Math.floor(Math.random()*(links.length+1))];
            break;
        default:
            break;
    }
}