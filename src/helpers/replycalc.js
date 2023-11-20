const { website, theLink } = require('./website.js');

var bloodyGifs = ["https://cdn.discordapp.com/attachments/669372366710898688/1175332478563651664/image0.gif?ex=656ad8ab&is=655863ab&hm=dc4afa1be5b9f0f72829d88f9b9944a36c1f97abb8760138712009ba264b9b1a&",
"https://cdn.discordapp.com/attachments/669372366710898688/1175332479251521585/image1.gif?ex=656ad8ab&is=655863ab&hm=7cea1d7a01a7b5bdbfaa75c3202d0fbe6df0cc59a6ffb658769eba49736114ec&",
"https://media.discordapp.net/attachments/669372366710898688/1175332479612223639/image2.gif?ex=656ad8ab&is=655863ab&hm=dfa1cab4e4ad5048ea11119c56a80672fcc3b1e86cc3bb7463f4cb4cacbb293f&="]

var atMe = [
    "`<@${message.author.id}>`",
    "why u do dis",
    "I should get to removing your ability to pinging me...",
    "Go pick on someone your own size! I'm just a pi...",
    `I heard you were bored so I found a random wikipedia article for you:\n`, // APPEND WIKI
    "https://cdn.discordapp.com/emojis/846049457221271582.webp?size=96&quality=lossless",
    "https://cdn.discordapp.com/emojis/609780784794042398.gif?size=96&quality=lossless",
    "https://cdn.discordapp.com/emojis/572456999338377236.webp?size=96&quality=lossless",
    "https://cdn.discordapp.com/emojis/586638848759562242.webp?size=96&quality=lossless",
    "https://cdn.discordapp.com/emojis/1018603042263793664.webp?size=96&quality=lossless",
    "https://cdn.discordapp.com/emojis/464520626594381854.webp?size=96&quality=lossless",
    "https://cdn.discordapp.com/emojis/586121174811934735.gif?size=96&quality=lossless",
    "https://cdn.discordapp.com/emojis/619600495866019856.webp?size=96&quality=lossless",
    "https://discord.com/assets/b83feaf9d8a57b2f3534.svg",
]


function getArray(text) {
    console.log("Workie2.1");
    var link;
    switch (text) {
        case "bloodyGifs":
            console.log("Workie2.2");
            link = random(bloodyGifs);
            break;
        case "wiki":
            console.log("workie2.21");
            
            console.log(new randomWiki());
            link = new randomWiki();
            console.log(wiki);
            console.log(randomWiki);
            // link = link;
            break;
            
        default:
            console.log("Workie2.22");
            break;
    }

    console.log("Workie2.3");
    return link;
}

function random(array){
    console.log("Workie11");
    const val = `${array[Math.floor(Math.random() * array.length)]}`;
    console.log("Workie12");
    return val;
}

function randomWiki(){
    console.log("workie55");
    var link = new website();
    console.log("workie1");
    console.log(link.theLink());

    // both work
    // console.log("a  " + link._link);
    // console.log("b  " + link.theLink());

    return link.theLink();
}

module.exports = { getArray }