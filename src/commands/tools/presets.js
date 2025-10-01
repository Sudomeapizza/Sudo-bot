const { SlashCommandBuilder, InteractionContextType, MessageFlags } = require('discord.js')
const { calcPresets } = require('../../helpers/presetCalc.js')
const presetsData = require('../../helpers/presets.json')
const presets = presetsData.presets;

// console.log('Loaded Presets:', presets);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('presets')
        .setDescription("Autofill presets!")
        .addStringOption(option =>
            option.setName('preset')
                .setDescription('select presets')
                .setAutocomplete(true)
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('args')
                .setDescription('preset options')
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

        if (focusedOption.name === 'preset') {
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
        const presetName = interaction.options.getString('preset');
        const argsString = interaction.options.getString('args');
        const silent = interaction.options.getBoolean('silent') ?? true;

        await interaction.deferReply({
            flags: silent ? MessageFlags.Ephemeral : undefined
        });

        const selectedPresetDefinition = presets[presetName];
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
                validationError = `Missing arguments for '${presetName}'. Expected: ${missingArgs}`;
            }
        }

        if (validationError) {
            await interaction.editReply({
                content: `Error: ${validationError}`,
            });
            return;
        }

        const result = calcPresets(presetName, parsedArgs);

        await interaction.editReply({
            content: result,
        });
    }

}