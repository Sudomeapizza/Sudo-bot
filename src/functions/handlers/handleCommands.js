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
                const fileName = command.data.name;
                
                if (!commandArray.some((cmd) => cmd.name === fileName)) {
                    commands.set(command.data.name, command);
                    commandArray.push(command.data.toJSON());
                    console.log(`command: ${fileName} has passed through the handler`);
                } else {
                    console.log(`-- command: ${fileName} already exists in the array`);
                }
            }
        }
        const rest = new REST({ version: "9" }).setToken(process.env.token);
        try {
            console.log("Started refreshing application (/) commands.");
            
            // Routes.applicationGuildCommands  process.env.GUILD_ID_2
            // Routes.applicationCommands
            await rest.put(Routes.applicationCommands(process.env.APP_ID), {
                body: commandArray,
            });

            console.log("Successfully reloaded application (/) commands.");

        } catch (error) {
            console.error(error);
        }
    }
}
