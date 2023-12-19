const chalk = require("chalk");

console.log("added 3");
module.export = {
    name: "disconnected",
    execute() {
        console.log(chalk.red("[Database Status]: Disconnected"));
    },
};