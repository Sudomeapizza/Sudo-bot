const chalk = require("chalk");

console.log("added 1");
module.export = {
    name: "connected",
    execute(client) {
        console.log(chalk.green("[Database Status]: Connected"));
    },
};