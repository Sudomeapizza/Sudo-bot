function timestampformat(timeType, userInput, format, outputOnly = false) {

    var time;

    if (timeType === "fT") {

        // TODO: RAINBOWS
        time = parseFixedInput(userInput)

    } else if (timeType === "rT") {

        if (userInput.match("[^\-0-9yMwdhms]")) {
            return "Error: Please only use y/M/w/d/h/m/s, \"-\", 0-9"
        }
        time = parseRelativeInput(userInput);
    }

    var result = "";

    switch (format) {
        case "yes":
            result += outputOnly ? `<t:${time}:R>\n` : `\`<t:${time}:R>\` - <t:${time}:R>\n`
            result += outputOnly ? `<t:${time}:t>\n` : `\`<t:${time}:t>\` - <t:${time}:t>\n`
            result += outputOnly ? `<t:${time}:T>\n` : `\`<t:${time}:T>\` - <t:${time}:T>\n`
            result += outputOnly ? `<t:${time}:d>\n` : `\`<t:${time}:d>\` - <t:${time}:d>\n`
            result += outputOnly ? `<t:${time}:D>\n` : `\`<t:${time}:D>\` - <t:${time}:D>\n`
            result += outputOnly ? `<t:${time}:f>\n` : `\`<t:${time}:f>\` - <t:${time}:f>\n`
            result += outputOnly ? `<t:${time}:F>` : `\`<t:${time}:F>\` - <t:${time}:F>`
            break;
        case "R":
            result = outputOnly ? `<t:${time}:R>` : `\`<t:${time}:R>\` - <t:${time}:R>`
            break;
        case "t":
            result = outputOnly ? `<t:${time}:t>` : `\`<t:${time}:t>\` - <t:${time}:t>`
            break;
        case "T":
            result = outputOnly ? `<t:${time}:T>` : `\`<t:${time}:T>\` - <t:${time}:T>`
            break;
        case "d":
            result = outputOnly ? `<t:${time}:d>` : `\`<t:${time}:d>\` - <t:${time}:d>`
            break;
        case "D":
            result = outputOnly ? `<t:${time}:D>` : `\`<t:${time}:D>\` - <t:${time}:D>`
            break;
        case "f":
            result = outputOnly ? `<t:${time}:f>` : `\`<t:${time}:f>\` - <t:${time}:f>`
            break;
        case "F":
            result = outputOnly ? `<t:${time}:F>` : `\`<t:${time}:F>\` - <t:${time}:F>`
            break;
        case "c":
            result = outputOnly ? `<t:${time}:F><t:${time}:R>` :
            `\`<t:${time}:F><t:${time}:R>\` - <t:${time}:F><t:${time}:R>`
            break;
        default:
            result = `Time Error: "${format}"`
            break;
    }

    return result;
}

function parseFixedInput(userInput) {
    return new Date(`"${userInput}"`).getTime().toString().slice(0, -3);
}

function parseRelativeInput(userInput) {

    var newDate = { date: new Date() };
    var number = "";
    var direction;
    // const direction = (typeof userInput.match("-") !== 'undefined')
    direction = userInput.match("-") ? -1 : 1;

    console.log("direction: " + direction)
    for (let c of userInput) {
        if (c.match("[0-9]")) {
            number = number + c;
        } else if (c.match("[yMwdhms]")) {
            // console.log(`Prev date: ${direction * parseInt(number, 10)}${c}\n    ` + newDate.date.toString());
            adjustTime(newDate.date, direction * parseInt(number, 10), c)
            // console.log(`Mod date:\n    ` + newDate.date.toString());
            number = "";
        }
    };

    return newDate.date.getTime().toString().slice(0, -3);
}

function adjustTime(date, amount, period) {
    switch (period) {
        case "y":
            date.setUTCMonth(date.getUTCMonth() + (12 * amount))
            break;
        case "M":
            date.setUTCMonth(date.getUTCMonth() + amount)
            break;
        case "w":
            date.setUTCHours(date.getUTCHours() + (24 * 7 * amount))
            break;
        case "d":
            date.setUTCHours(date.getUTCHours() + (24 * amount))
            break;
        case "h":
            date.setUTCHours(date.getUTCHours() + amount)
            break;
        case "m":
            date.setUTCMinutes(date.getUTCMinutes() + amount)
            break;
        case "s":
            date.setUTCSeconds(date.getUTCSeconds() + amount)
            break;
    }
}

module.exports = { timestampformat, parseRelativeInput, parseFixedInput };
