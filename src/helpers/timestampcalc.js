const { dateRegex } = require('regex.js');

function timeStampCalc(date, time, region, format, internal = false){
    // this is in UTC
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
            // shrug
            break;
    }

    
    if (internal) {
        fullResponse = [`<t:${timestamp}:${format}>`];
    } else {
        fullResponse = [`Timestamp code: \`<t:${timestamp}:${format}>\`\n`
        + `How it appears: <t:${timestamp}:${format}>`,
        `<t:${timestamp}:${format}>`];
    }

    return fullResponse;
}

function goToDate(message) {
    // i => itterativeDate
    var idate = new Date();
    var targetDate = dateRegex(message);
    var options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
    while (idate.toLocaleDateString("en-US", options) != targetDate[1]) {
        console.log(idate.toLocaleDateString("en-US", options) + " |||||| " + targetDate[1]);
        idate = Date.parse(idate); // convert to num
        console.log("==" + idate);
        idate += 3600*24*1000; // 1 hour in seconds x 24 hours x 1000 miliseconds
        idate = new Date(idate) // convert to date
        console.log(">>" + idate);
        options = {weekday: 'short'};
      }
      
      return idate.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });      
}

module.exports = { timeStampCalc, goToDate };