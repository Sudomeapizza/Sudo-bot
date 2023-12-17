const chalk = require("chalk");

module.export = {
    name: "disconnected",
    execute(client) {
        console.log(chalk.red("[Database Status]: Disconnected"));
    },
};