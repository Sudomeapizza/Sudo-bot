const chalk = require("chalk");

module.export = {
    name: "connecting",
    async execute(client) {
        console.log(chalk.cyan("[Database Status]: Connecting..."));
    },
};