const chalk = require("chalk");

console.log("added 4");
module.export = {
    name: "err",
    execute(client) {
        console.log(chalk.red(`An error occured with the database connection:\n${err}`));
    },
};