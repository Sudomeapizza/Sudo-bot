const chalk = require("chalk");

module.export = {
    name: "err",
    execute(client) {
        console.log(chalk.red(`An error occured with the database connection:\n${err}`));
    },
};