const chalk = require("chalk");

console.log("added 1");
module.exports = {
    name: "connected",
    execute() {
        console.log(chalk.green("[Database Status]: Connected"));
    },
};