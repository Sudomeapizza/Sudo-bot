const chalk = require("chalk");

module.export = {
    name: "connected",
    execute(client) {
        console.log(chalk.green("[Database Status]: Connected"));
    },
};