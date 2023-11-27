
function dateRegex(sentence) {
    const regexPattern = /\b(?:mon|tue|wed|thu|thurs|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday|today|tonight|tomorrow)\b\s(?:at|@)\s((?:[0]\d|[01]?\d|2[0-3]):?[0-5]\d)?/i;
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