const { dateRegex } = require('./regex.js');
const { getRegion } = require('./user.js');
const { getTimeZone } = require('../functions/Database/getTimeZone.js');

function timeStampCalc(date, time, region, format, internal = false, userId, client){
    // this is in UTC
    var time1, time2;
    
    // if using shortened time (EX: "1:40")
    if (time.includes(':') && time.length == 4) {
        time = '0' + time;
        time1 = time.slice(1,2);
        time2 = time.slice(3,5);

    // insert colon if using 4 digits (EX: "1200")
    } else if (!time.includes(':') && time.length == 4) {
        time = time.slice(0, 2) + ':' + time.slice(2);
        time1 = time.slice(0,2);
        time2 = time.slice(3,5);

    // insert colon if using 3 digits (EX: "100", "010")
    } else if (!time.includes(':') && time.length == 3) {
        time = '0' + time.slice(0, 1) + ':' + time.slice(1);
        time1 = time.slice(0,1);
        time2 = time.slice(1,3);
    }

    // var timestamp = Date.parse(`${date} ${time}`)/1000;
    var fullResponse, timestamp;
    
    // hour changes by 3,600,000
    const change = 3600;

    // var options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' , time: 'short'};
    var localTimeZone = client.getTimeZone(userId);
    if (!localTimeZone) {
        console.log("was false");
        return false;
    } else {
        timestamp = new Date(new Date()
            .toLocaleString("en-US", {
                timeZone: client.getTimeZone(userId)
            })).setHours(time1, time2, 0, 0);
        if (internal) {
            fullResponse = [`<t:${timestamp}:F>`,`<t:${timestamp}:R>`];
        } else {
            fullResponse = [`Timestamp code: \`<t:${timestamp}:${format}>\`\n`
            + `How it appears: <t:${timestamp}:${format}>`,
            `<t:${timestamp}:${format}>`];
        }
        return fullResponse;
    }

    // switch (region) {
    //     case "pst":
    //         timestamp;
    //         break;
    //     case "mst":
    //         timestamp -= change * 1;
    //         break;
    //     case "cst":
    //         timestamp -= change * 2;
    //         break;
    //     case "est":
    //         timestamp -= change * 3;
    //         break;
    //     default:
    //         return false;
    // }
}

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

function advanceADay(inputDay, targetDay, nextDay=false){
    var idate = new Date();

    while (inputDay != targetDay) {
        options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
        idate.setDate(idate.getDate() + 1); // Increment the date by one day
        options = {weekday: 'short'};
        inputDay = getDay(idate.toLocaleDateString("en-US", options).toLowerCase());
        if (nextDay) break;
    }
    return idate.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }); 
}

function goToDate(message) {
    // i => itterativeDate
    var idate = new Date();

    var targetDate = dateRegex(message);
    var inputDay, targetDay;
    var options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
    options = {weekday: 'short'};
    targetDay = getDay(targetDate[1].toLowerCase());
    inputDay = getDay(idate.toLocaleDateString("en-US", options).toLowerCase());

    switch (targetDate[1].toLowerCase()) {
        case "today":
        case "tonight":
            return idate.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
        case "tomorrow":
            return advanceADay(inputDay, targetDate, true);
        default:
            console.log("other day");
            return advanceADay(inputDay, targetDate);
    } 
}

function timeConvert(message, client) {
    
    // if bot, return
    if (message.author.bot) {return;}
    
    // easy access to variable
    var userMessage = message.content;
    
    // try getting values from Regex
    const info = dateRegex(userMessage);

    // if there's content: continue, else ignore message.
    if (info[0] != null) {
        // 
        const targetDate = goToDate(userMessage);
        var timestamp = timeStampCalc(targetDate, info[0], getRegion(message.author.id), 'D', true, message.author.id, client);
        var newMessage;
        
        // replace it correctly if it contains a "at" or "@"
        if (userMessage.includes(`${info[1]} at ${info[0]}`)) {
            newMessage = userMessage.replace(`${info[1]} at ${info[0]}`,`${timestamp[0]} ${timestamp[1]}`);
        } else if (userMessage.includes(`${info[1]} @ ${info[0]}`)) {
            newMessage = userMessage.replace(`${info[1]} @ ${info[0]}`,`${timestamp[0]} ${timestamp[1]}`);
        }

        if (timestamp) {
            message.channel.send(newMessage || "None4");
        } else {
            message.author.send({
                content: "You do not have a region set internally, please specify your region."
            });
        }
    }
}

module.exports = { timeStampCalc, goToDate, timeConvert };