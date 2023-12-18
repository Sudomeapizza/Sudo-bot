const region = {
    "210932800000491520":"est",
    "165591144451932160":"est",
    "165615258965114880":"est",
    "294183255307976705":"est",
    "604103615254233092":"pst"
}

function getRegion(userId) {
    return region[userId];
}

module.exports = { getRegion };