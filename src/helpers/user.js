const region = {
    "210932800000491520":"pst",
    "165591144451932160":"est",
    "165615258965114880":"est",
    "294183255307976705":"est"
}

function getRegion(userId) {
    return region[userId];
}

modules.export = { getRegion };