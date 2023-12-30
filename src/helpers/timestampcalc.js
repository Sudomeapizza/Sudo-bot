const { getTimeZone } = require('../functions/Database/getTimeZone.js');

/**
 * Return new Timecode in UTC format
 * @param {int} timeInDays 
 * @param {String} time 
 * @param {String} region 
 * @returns String UTC timecode
 */
function timeStampCalc(timeInDays, time, region){
    console.log(`${timeInDays} | ${time} | ${region}`);

    // if no region set
    if (!region) return false;

    // this is in UTC
    var time1, time2;
    time = time.toString();
    
    // if using shortened time (EX: "1:40")
    if (time.includes(':') && time.length == 4) {
        console.log("1");
        time = '0' + time;
        time1 = time.slice(1,2);
        time2 = time.slice(3,5);

    // insert colon if using 4 digits (EX: "1200")
    } else if (!time.includes(':') && time.length == 4) {
        console.log("2");
        // time = time.slice(0, 2) + ':' + time.slice(2);
        time1 = time.slice(0,2);
        time2 = time.slice(2,4);

    // insert colon if using 3 digits (EX: "100", "010")
    } else if (!time.includes(':') && time.length == 3) {
        console.log("3");
        time = '0' + time.slice(0, 1) + ':' + time.slice(1);
        time1 = time.slice(0,1);
        time2 = time.slice(1,3);
    } else {
        console.log("4");
        time1 = time.slice(0,2);
        time2 = time.slice(3,5);
    }

    console.log(`::${timeInDays} ::${adjustTime(region)}`);
    var timestamp = new Date();
    console.log(timestamp.toLocaleString());

    timestamp.setHours(time1, time2, 0, 0);
    console.log(timestamp.toLocaleString());

    timestamp.setHours(timestamp.getHours() - adjustTime(region));
    console.log(timestamp.toLocaleString());

    timestamp.setHours(timestamp.getHours() + (timeInDays * 24));
    console.log(timestamp.toLocaleString());

    // trim off the ms, and return time in seconds
    timestamp = timestamp.getTime().toString().slice(0, -3);
    return timestamp;
}

/**
 * Integer hours difference from server host region
 * @param {String} region 
 * @returns Int hours
 */
function adjustTime(region) {
    const reference = [
        {name: "JST", value: 17},
        {name: "SGT", value: 16},
        {name: "WIB", value: 15},
        {name: "BST", value: 14},
        {name: "UZT", value: 13},
        {name: "GST", value: 12},
        {name: "MSK", value: 11},
        {name: "EET", value: 10},
        {name: "CET", value: 9},
        {name: "GMT", value: 8},
        {name: "CVT", value: 7},
        {name: "CGT", value: 6},
        {name: "ART", value: 5},
        {name: "VET", value: 4},
        {name: "EST", value: 3},
        {name: "CST", value: 2},
        {name: "MST", value: 1},
        {name: "PST", value: 0},
        {name: "HST", value: -1},
        {name: "NUT", value: -2},
        {name: "AoE", value: -3},
        {name: "ANAT", value: -4},
        {name: "AEDT", value: -5},
        {name: "AEST", value: -6},
        {name: "AKST", value: -7},
    ];
    for (var i = 0; i < reference.length; i++) {
        if (reference[i].name == region.toLocaleUpperCase()) { 
            return reference[i].value;
        }
    }
    return false;
}

/**
 * Converts common Day names to a uniform format useable within code
 * @param {String} dateDay 
 * @returns String of standardized days
 */
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

/**
 * while (tomorrow) is false, increment inputDay DATE class to equal targetDay
 * @param {String} inputDay 
 * @param {String} targetDay 
 * @param {Boolean} nextDay 
 * @returns Int of days incremented
 */
function advanceADay(inputDay, targetDay, nextDay = false){
    var idate = new Date();
    var counter = 0;
    while (inputDay != targetDay) {
        options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
        idate.setDate(idate.getDate() + 1); // Increment the date by one day
        options = { weekday: 'short' };
        inputDay = getDay(idate.toLocaleDateString("en-US", options).toLowerCase());
        if (nextDay) break;
        if (counter >= 50) {
            console.error("INFINITE LOOP IN ADVANCE A DAY"); break; 
        } else counter++;
    }
    return counter; 
}

/**
 * figures out based on day given how many days to advance from today's date
 * @param {String} message 
 * @returns # of days to advance
 */
function goToDate(message) {
    // i => itterativeDate
    var idate = new Date();
    
    var inputDay, targetDay;
    var options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
    options = { weekday: 'short' };
    // console.log(message);
    // console.log(message.toLocaleLowerCase());

    targetDay = getDay(message.toLowerCase());
    inputDay = getDay(idate.toLocaleDateString("en-US", options).toLowerCase());

    switch (message.toLowerCase()) {
        case "today":
        case "tonight":
            return 0;
        case "tomorrow":
            return 1;
        default:
            return advanceADay(inputDay, targetDay);
    } 
}

//edited the outputs of this function
/**
 * Special Saause
 * @param {*} userMessage 
 * @param {*} localTimeZone 
 */
function timeConvert(message, localTimeZone, command = false) {
    
    // if bot, return
    if (message.author.bot) {return;}

    // if no region was set for the user, do nothing
    if (localTimeZone == false) {return;}
    
    // easy access to variable
    var userMessage = message.content;
    
    const regexDay = /\b(?:in|mon|tue|wed|thu|thurs|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday|today|tonight|tomorrow)\b/gi;
    const regexAt = /\b(?:at|@)\b/gi;
    const regexTime = /([0-2]?[0-9]|1[0-2]|2[0-3])(:?[0-5][0-9])?/gi;
    const regex_AMPM = /(?:am|pm)/gi;
    const regexAMPM = /\b(?:am|pm)\b/gi;

    /**
     * 0 - day
     * 1 - at/@
     * 2 - time
     * 3 - <am/pm>
     */
    var RegexMatch = [];
    var tempMatch;

    var resultingMessage = userMessage.split(" ");
    for (var i = 0; i < resultingMessage.length; i++) {

        console.log(resultingMessage[i]);
        // `today`
        if (RegexMatch[0] = resultingMessage[i].match(regexDay)){

            console.log("~" + resultingMessage[i + 1]);

            // `in`
            // if (RegexMatch[0] == "")

            // today `at`
            if (i + 1 < resultingMessage.length && (RegexMatch[1] = resultingMessage[i + 1].match(regexAt))){

                console.log("~~" + resultingMessage[i + 2]);
                // today at `9:00`
                if (i + 2 < resultingMessage.length && (RegexMatch[2] = resultingMessage[i + 2].match(regexTime))){
                    // console.log("~~~" + resultingMessage[i + 2].match(regexTime));
                    // console.log("~~~" + resultingMessage[i + 2].match(regex_AMPM));

                    // test for if there is an AM/PM
                    // today at 9:00`am`
                    RegexMatch[3] = resultingMessage[i + 2].match(regex_AMPM);

                    if (RegexMatch[3]) {
                        console.log("__" + RegexMatch[2][0].split(":")[0]);
                        // 9:00am | 900am | 
                        
                        if (RegexMatch[2][0].toString().length == 4) {
                            tempMatch = RegexMatch[2][0].toString().slice(0,1);
                            console.log(`1splitting "${RegexMatch[2][0]} into ${tempMatch}`);
                        } else {
                            tempMatch = RegexMatch[2][0].toString().slice(0,2);
                            console.log(`2splitting "${RegexMatch[2][0]} into ${tempMatch}`);
                        }


                        console.log(tempMatch);
                        if (tempMatch <= 12) {
                            console.log("under/equals 12 hours ");
   

                            console.log(RegexMatch);


                            console.log("~~~" + RegexMatch[0]);
                            console.log("~~~" + RegexMatch[0][0]);

                            var targetDate = goToDate(RegexMatch[0].toString());
                            console.log(targetDate);
                            

                            // add half a day if it's pm
                            if (RegexMatch[3][0].toString().toLowerCase() == "pm" && tempMatch <= 11){
                                // add 12 hours to the clock
                                targetDate += .5;
                            }
                            // subtract half a day so it's midnight
                            if (RegexMatch[3][0].toString().toLowerCase() == "am"){
                                // add 12 hours to the clock
                                targetDate -= .5;
                            }

                            // gives duo timecodes of
                            var timestamp = timeStampCalc(targetDate, RegexMatch[2], localTimeZone);

                            console.log(timestamp);
                            var newMessage;
                            
                            if (RegexMatch[3]) {
                                newMessage = userMessage.replace(
                                    `${RegexMatch[0]} ${RegexMatch[1]} ${RegexMatch[2]}${RegexMatch[3]}`,
                                    `<t:${timestamp}:F> <t:${timestamp}:R>`);
                            } else {
                                newMessage = userMessage.replace(
                                    `${RegexMatch[0]} ${RegexMatch[1]} ${RegexMatch[2]}`,
                                    `<t:${timestamp}:F> <t:${timestamp}:R>`);
                            }
                            userMessage = newMessage;
                            resultingMessage = userMessage.split(" ");
                            // console.log(newMessage);

                        } else {
                            console.log("can't do more than 12hours in am/pm1");
                        }
                        
                    // today at 9:00 `am`
                    } else if (i + 3 < resultingMessage.length && (RegexMatch[3] = resultingMessage[i + 3].match(regexAMPM))){
                        
                        console.log("__" + RegexMatch[2][0].split(":")[0]);
                        // 9:00am | 900am | 
                        
                        if (RegexMatch[2][0].toString().length == 4) {
                            tempMatch = RegexMatch[2][0].toString().slice(0,1);
                            console.log(`1splitting "${RegexMatch[2][0]} into ${tempMatch}`);
                        } else {
                            tempMatch = RegexMatch[2][0].toString().slice(0,2);
                            console.log(`2splitting "${RegexMatch[2][0]} into ${tempMatch}`);
                        }


                        console.log(tempMatch);
                        if (tempMatch <= 12) {
                            console.log("under/equals 12 hours ");
   

                            console.log(RegexMatch);


                            console.log("~~~" + RegexMatch[0]);
                            console.log("~~~" + RegexMatch[0][0]);

                            var targetDate = goToDate(RegexMatch[0].toString());
                            console.log(targetDate);
                            

                            // add half a day if it's pm
                            if (RegexMatch[3][0].toString().toLowerCase() == "pm" && tempMatch <= 11){
                                // add 12 hours to the clock
                                targetDate += .5;
                            }
                            // subtract half a day so it's midnight
                            if (RegexMatch[3][0].toString().toLowerCase() == "am"){
                                // add 12 hours to the clock
                                targetDate -= .5;
                            }

                            // gives duo timecodes of
                            var timestamp = timeStampCalc(targetDate, RegexMatch[2], localTimeZone);

                            console.log(timestamp);
                            var newMessage;
                            
                            if (RegexMatch[3]) {
                                newMessage = userMessage.replace(
                                    `${RegexMatch[0]} ${RegexMatch[1]} ${RegexMatch[2]} ${RegexMatch[3]}`,
                                    `<t:${timestamp}:F> <t:${timestamp}:R>`);
                            } else {
                                newMessage = userMessage.replace(
                                    `${RegexMatch[0]} ${RegexMatch[1]} ${RegexMatch[2]}`,
                                    `<t:${timestamp}:F> <t:${timestamp}:R>`);
                            }

                            userMessage = newMessage;
                            resultingMessage = userMessage.split(" ");
                            // console.log(newMessage);
                        } else {
                            console.log("can't do more than 12hours in am/pm2");
                        }

                        // today at 9:00 
                    } else {
                        var targetDate = goToDate(RegexMatch[0].toString());
                        console.log(targetDate);

                        // gives duo timecodes of
                        var timestamp = timeStampCalc(targetDate, RegexMatch[2], localTimeZone);

                        console.log(timestamp);
                        var newMessage;
                        
                        if (RegexMatch[3]) {
                            newMessage = userMessage.replace(
                                `${RegexMatch[0]} ${RegexMatch[1]} ${RegexMatch[2]}${RegexMatch[3]}`,
                                `<t:${timestamp}:F> <t:${timestamp}:R>`);
                        } else {
                            newMessage = userMessage.replace(
                                `${RegexMatch[0]} ${RegexMatch[1]} ${RegexMatch[2]}`,
                                `<t:${timestamp}:F> <t:${timestamp}:R>`);
                        }
                        userMessage = newMessage;
                        resultingMessage = userMessage.split(" ");
                        // console.log(newMessage);
                    }
                    i++;
                }
            }
            // console.log(resultingMessage[i]);
        }
        // console.log(resultingMessage[i]);
    }
    return newMessage;
}


function timeStampCalc2(timeInDays, time, region){
    console.log(`${timeInDays} | ${time} | ${region}`);

    // if no region set
    if (!region) return false;

    // this is in UTC
    var time1, time2;
    time = time.toString();
    
    // if using shortened time (EX: "1:40")
    if (time.includes(':') && time.length == 4) {
        console.log("1");
        time = '0' + time;
        time1 = time.slice(1,2);
        time2 = time.slice(3,5);

    // insert colon if using 4 digits (EX: "1200")
    } else if (!time.includes(':') && time.length == 4) {
        console.log("2");
        // time = time.slice(0, 2) + ':' + time.slice(2);
        time1 = time.slice(0,2);
        time2 = time.slice(2,4);

    // insert colon if using 3 digits (EX: "100", "010")
    } else if (!time.includes(':') && time.length == 3) {
        console.log("3");
        time = '0' + time.slice(0, 1) + ':' + time.slice(1);
        time1 = time.slice(0,1);
        time2 = time.slice(1,3);
    } else {
        console.log("4");
        time1 = time.slice(0,2);
        time2 = time.slice(3,5);
    }

    console.log(`::${timeInDays} ::${adjustTime(region)}`);
    var timestamp = new Date();
    console.log(timestamp.toLocaleString());

    timestamp.setHours(time1, time2, 0, 0);
    console.log(timestamp.toLocaleString());

    timestamp.setHours(timestamp.getHours() - adjustTime(region));
    console.log(timestamp.toLocaleString());

    timestamp.setHours(timestamp.getHours() + (timeInDays * 24));
    console.log(timestamp.toLocaleString());

    // trim off the ms, and return time in seconds
    timestamp = timestamp.getTime().toString().slice(0, -3);
    return timestamp;
}

module.exports = { timeStampCalc, timeStampCalc2, goToDate, timeConvert };