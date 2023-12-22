const { dateRegex } = require('./regex.js');
const { getRegion } = require('./user.js');
const { getTimeZone } = require('../functions/Database/getTimeZone.js');

function timeStampCalc(date, time, region, format, internal = false){
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
        time2 = time.slice(2,4);

    // insert colon if using 3 digits (EX: "100", "010")
    } else if (!time.includes(':') && time.length == 3) {
        time = '0' + time.slice(0, 1) + ':' + time.slice(1);
        time1 = time.slice(0,1);
        time2 = time.slice(1,3);
    }
    time1 = time.slice(0,2);
    time2 = time.slice(3,5);

    // var timestamp = Date.parse(`${date} ${time}`)/1000;
    var fullResponse, timestamp;

    // var options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' , time: 'short'};
    region = region.timeZone;
    console.log(`lala: ${region} time1: ${time1} time2: ${time2} time: ${timestamp}`);
    if (region == false) {
        console.log("was false");
        return false;
    } else {
        console.log(new Date(date.toLocaleString("en-US")));
        date = new Date(date);
        // add/subtract based on pi's timezone
        var timestamp = adjustTime(date, region);

        timestamp.setHours(time1, time2, 0, 0);
        // set time

        // var timestamp = new Date(date.toLocaleString("en-US", {timeZone: region}));
        // console.log(timestamp);
        // timestamp.setHours(time1, time2, 0, 0);
        console.log(timestamp);
        timestamp = new Date(timestamp).getTime()/1000;
        console.log(timestamp);
        if (internal) {
            fullResponse = [`<t:${timestamp}:F>`,`<t:${timestamp}:R>`];
        } else {
            fullResponse = [`Timestamp code: \`<t:${timestamp}:${format}>\`\n`
            + `How it appears: <t:${timestamp}:${format}>`,
            `<t:${timestamp}:${format}>`];
        }
        return fullResponse;
    }
}

function adjustTime(date, region) {
    //
    const reference = [
        {name: "JST", value: "17"},
        {name: "CST", value: "16"},
        {name: "WIB", value: "15"},
        {name: "BST", value: "14"},
        {name: "UZT", value: "13"},
        {name: "GST", value: "12"},
        {name: "MSK", value: "11"},
        {name: "EET", value: "10"},
        {name: "CET", value: "9"},
        {name: "GMT", value: "8"},
        {name: "CVT", value: "7"},
        {name: "CGT", value: "6"},
        {name: "ART", value: "5"},
        {name: "VET", value: "4"},
        {name: "EST", value: "3"},
        {name: "CST", value: "2"},
        {name: "MST", value: "1"},
        {name: "PST", value: "0"},
        {name: "HST", value: "-1"},
        {name: "NUT", value: "-2"},
        {name: "AoE", value: "-3"},
        {name: "ANAT", value: "-4"},
        {name: "AEDT", value: "-5"},
        {name: "AEST", value: "-6"},
        {name: "AKST", value: "-7"},
    ];
    for (var i = 0; i < reference.length; i++) {
        if (reference[i].name == region) { 
            console.log(`${date}\n${date + reference[i].value}`)
            return date + reference[i].value;
            // return date.setHours(date.getHours() + reference[i].value());
            break;
        }
    }
    return false;
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
    var counter = 0;
    while (inputDay != targetDay) {
        console.log(`${inputDay} ${targetDay}`);
        options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
        idate.setDate(idate.getDate() + 1); // Increment the date by one day
        options = { weekday: 'short' };
        inputDay = getDay(idate.toLocaleDateString("en-US", options).toLowerCase());
        if (nextDay) break;
        if (counter >= 50) {
            console.error("INFINITE LOOP IN ADVANCE A DAY"); break; 
        } else counter++;
        console.log(`-${inputDay} ${targetDay}`);
    }
    return idate.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }); 
}

function goToDate(message) {
    // i => itterativeDate
    var idate = new Date();

    var targetDate = dateRegex(message);
    var inputDay, targetDay;
    var options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
    options = { weekday: 'short' };
    console.log(targetDate);
    targetDay = getDay(targetDate[1].toLowerCase());
    inputDay = getDay(idate.toLocaleDateString("en-US", options).toLowerCase());

    switch (targetDate[1].toLowerCase()) {
        case "today":
        case "tonight":
            console.log("same day");
            return idate.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
        case "tomorrow":
            console.log("tomorrow");
            return advanceADay(inputDay, targetDay, true);
        default:
            console.log("other day");
            return advanceADay(inputDay, targetDay);
    } 
}

function timeConvert(message, localTimeZone) {
    
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
        var timestamp = timeStampCalc(targetDate, info[0], localTimeZone, 'D', true, message.author.id);
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