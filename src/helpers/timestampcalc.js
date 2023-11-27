const { dateRegex } = require('./regex.js');
const { getRegion } = require('./user.js');

function timeStampCalc(date, time, region, format, internal = false){
    // this is in UTC
    
    // if using shortened time (EX: "1:40")
    if (time.includes(':') && time.length == 4) {
        time = '0' + time;

    // insert colon if using 4 digits (EX: "1200")
    } else if (!time.includes(':') && time.length == 4) {
        time = time.slice(0, 2) + ':' + time.slice(2);

    // insert colon if using 3 digits (EX: "100", "010")
    } else if (!time.includes(':') && time.length == 3) {
        time = '0' + time.slice(0, 1) + ':' + time.slice(1);
    }
    console.log(time);

    var timestamp = Date.parse(`${date} ${time}`)/1000;
    var fullResponse;
            
    // hour change by 3,600,000
    const change = 3600;

    switch (region) {
        case "pst":
            timestamp += change * 8;
            break;
        case "mst":
            timestamp += change * 7;
            break;
        case "cst":
            timestamp += change * 6;
            break;
        case "est":
            timestamp += change * 5;
            break;
        default:
            return false;
            break;
    }

    if (internal) {
        fullResponse = [`<t:${timestamp}:F>`,`<t:${timestamp}:R>`];
    } else {
        fullResponse = [`Timestamp code: \`<t:${timestamp}:${format}>\`\n`
        + `How it appears: <t:${timestamp}:${format}>`,
        `<t:${timestamp}:${format}>`];
    }

    return fullResponse;
}

//var here = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));;
//console.log(`Here: ${here.toLocaleDateString("en-US",options)}`);

function getDay(dateDay){
    switch (dateDay) {
        case 'sun':
        case 'sunday':
            return 'sun';
        case 'mon':
        case 'monday':
            return 'mon';
        case 'tue':
        case 'tuesday':
            return 'tue';
        case 'wed':
        case 'wednesday':
            return 'wed';
        case 'thu':
        case 'thurs':
        case 'thursday':
            return 'thurs';
        case 'fri':
        case 'friday':
            return 'fri';
        case 'sat':
        case 'saturday':
            return 'sat';
        default:
            return false;
    }
}

function goToDate(message) {
    // i => itterativeDate
    var idate = new Date();
    var targetDate = dateRegex(message);
    var inputDay, targetDay;
    var options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
    options = {weekday: 'short'};

    if (!(targetDate[1].toLowerCase() == "today" || targetDate[1].toLowerCase() == "tonight")) {
        targetDay = getDay(targetDate[1].toLowerCase());
        inputDay = getDay(idate.toLocaleDateString("en-US", options).toLowerCase());

        while (inputDay != targetDay) {
            options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
            idate = Date.parse(idate); // convert to num
            idate += 3600*24*1000; // 1 hour in seconds x 24 hours x 1000 miliseconds
            idate = new Date(idate) // convert to date
            options = {weekday: 'short'};
            inputDay = getDay(idate.toLocaleDateString("en-US", options).toLowerCase());
        }
    }
    return idate.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });      
}

function timeConvert(message) {
    // if (message.guildId === '1076645110390984714'
    // || message.guildId === '351882915153707008') {
        if (message.author.bot) {return;}
        var userMessage = message.content;
        const info = dateRegex(userMessage);
        if (info[0] != null) {
            const targetDate = goToDate(userMessage);
            var timestamp = timeStampCalc(targetDate, info[0], getRegion(message.author.id), 'D', true);4
            var newMessage = userMessage.replace(`${info[1]} at ${info[0]}`,`${timestamp[0]} ${timestamp[1]}`);
            if (timestamp) {
                message.channel.send(newMessage || "None4");
            } else {
                message.author.send({
                    content: "You do not have a region set internally, please specify your region."
                });
            }
        }
    // }
}

module.exports = { timeStampCalc, goToDate, timeConvert };