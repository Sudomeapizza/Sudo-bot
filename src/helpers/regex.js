
function dateRegex(sentence) {
    const regexPattern = /\b(?:mon|tue|wed|thurs|fri|sat|sun)\b\s(?:at|@)\s((:0?[0-9]|1[0-9]|2[0-4])(?::[0-5][0-9])?)\s?(am|pm)?/i;

    const match = sentence.match(regexPattern);
    var data = [];

    if (match) {
        const time = match[1];
        const day = match[0].split(/\s+/)[0];
        data = [time, day];
    } else {
        date = [null];
    }
    return data; // return target day and time
}

module.exports = { dateRegex }; 