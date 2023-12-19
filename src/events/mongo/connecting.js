const chalk = require("chalk");

console.log("added 2");
module.export = {
    name: "connecting",
    async execute() {
        console.log(chalk.cyan("[Database Status]: Connecting..."));
    },
};