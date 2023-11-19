// import requests
// import webbrowser
// from bs4 import BeautifulSoup
const { requests } = require('requests');


///////////////////////////


var https = require('http');
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!'); // This will serve your request to '/'.
});

app.listen(3010, function () {
  console.log('Example app listening on port 3010!');
 });

/**
 * HOW TO Make an HTTP Call - GET
 */
// options for GET
var optionsget = {
    host : 'localhost',
    port : 3010,
    path : '/quote/random', // the rest of the url with parameters if needed
    method : 'GET' // do GET
};

console.info('Options prepared:');
console.info(optionsget);
console.info('Do the GET call');

// do the GET request
var reqGet = https.request(optionsget, function(res) {
    console.log("statusCode: ", res.statusCode);
    // uncomment it for header details
//  console.log("headers: ", res.headers);


    res.on('data', function(d) {
        console.info('GET result:\n');
        process.stdout.write(d);
        console.info('\n\nCall completed');
    });

});

reqGet.end();
reqGet.on('error', function(e) {
    console.error(e);
});



///////////////////

var bloodyGifs = ["https://cdn.discordapp.com/attachments/669372366710898688/1175332478563651664/image0.gif?ex=656ad8ab&is=655863ab&hm=dc4afa1be5b9f0f72829d88f9b9944a36c1f97abb8760138712009ba264b9b1a&",
"https://cdn.discordapp.com/attachments/669372366710898688/1175332479251521585/image1.gif?ex=656ad8ab&is=655863ab&hm=7cea1d7a01a7b5bdbfaa75c3202d0fbe6df0cc59a6ffb658769eba49736114ec&",
"https://media.discordapp.net/attachments/669372366710898688/1175332479612223639/image2.gif?ex=656ad8ab&is=655863ab&hm=dfa1cab4e4ad5048ea11119c56a80672fcc3b1e86cc3bb7463f4cb4cacbb293f&="]

var atMe = [
    "`<@${message.author.id}>`",
    "why u do dis",
    "I should get to removing your ability to pinging me...",
    "Go pick on someone your own size! I'm just a pi...",
    `I heard you were bored so I found a random wikipedia article for you:\n${randomWiki()}`,
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

var wiki = [`${randomWiki()}`];


function getArray(gif) {
    switch (gif) {
        case "bloodyGifs":
            return random(bloodyGifs);
        case "":
            return
        default:
            break;
    }
}

function random(array){
    return `${array[Math.floor(Math.random() * array.length)]}`
}

function randomWiki(){
    article_page = requests.get(wiki_url)

    soup = BeautifulSoup(article_page.text, "html.parser")
    article_title = soup.find(id='firstHeading')
    
    response = `${article_title.string}`
    return response;
}

module.exports = { getArray }