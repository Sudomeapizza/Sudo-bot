const { InteractionResponse, MessageFlags, InteractionType } = require("discord.js");
const { reportCrash } = require("../../helpers/crash");

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {

        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
                if (interaction.deferred || interaction.replied) {
                    await reportCrash(client, );
                    await interaction.followUp({ content: 'There was an error while executing this command! Report sent!', ephemeral: true });
                } else {
                    await reportCrash(client, `Interaction system: ${timestampformat("rT", "now", "F", true)}\n\nError:\n` + ((error && error.stack) ? error.stack : error.toString()));
                    await interaction.reply({ content: 'There was an error while executing this command! Report sent!', ephemeral: true });
                }
            }
        }
        // Handle autocomplete interactions
        else if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.autocomplete(interaction);
            } catch (error) {
                console.error(error);
            }
        }
    }
}