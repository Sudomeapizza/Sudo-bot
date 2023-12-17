const chalk = require("chalk");

module.export = {
    name: "connecting",
    execute(client) {
        console.log(chalk.cyan("[Database Status]: Connecting..."));
    },
};