function timeStampCalc(date, time, region, format){
    // this is in UTC
    var timestamp = Date.parse(`${date} ${time}`)/1000;
            
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

    var fullResponse = [`Timestamp code: \`<t:${timestamp}:${format}>\`\n`
    + `How it appears: <t:${timestamp}:${format}>`,
    `<t:${timestamp}:${format}>`];

    return fullResponse;
}

export {timeStampCalc};
