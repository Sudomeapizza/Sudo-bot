const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const fs = require('fs');

module.exports = (client) => {
    const { commands, commandArray } = client;
    client.handleCommands = async() => {
        // const commandFolders = fs.readdirSync("./src/commands");
        const commandFolders = fs.readdirSync(`./src/commands`);
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter((file) => file.endsWith(".js"));
            for (const file of commandFiles) {
                const command = require(`../../commands/${folder}/${file}`);
                commands.set(command.data.name, command);
                commandArray.push(command.data.toJSON());
                console.log(`command: ${command.data.name} has passed through the handler`);
            }
        }
        const clientId = '823697716076347423';
        const guildId = '351882915153707008';
        const rest = new REST({ version: "9" }).setToken(process.env.token);
        try {
            console.log("Started refreshing application (/) commands.");
            
            // Routes.applicationGuildCommands
            //Routes.applicationCommands
            await rest.put(Routes.applicationCommands(clientId, guildId), {
                body: commandArray,
            });

            console.log("Successfully reloaded application (/) commands.");

        } catch (error) {
            console.error(error);
        }
    }
}