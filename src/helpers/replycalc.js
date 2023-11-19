var wget = require('wget-improved');
// var XMLHttpRequest = require('xhr2');

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

var wiki = randomWiki();


function getArray(gif) {
    switch (gif) {
        case "bloodyGifs":
            return random(bloodyGifs);
        case "wiki":
            return wiki;
        default:
            break;
    }
}

function random(array){
    const val = `${array[Math.floor(Math.random() * array.length)]}`;
    console.log(val);
    return val;
}

function randomWiki(){
    const source = ['https://en.wikipedia.org/w/api.php?format=json&action=query&generator=random&grnnamespace=0&rvprop=content&grnlimit=1',
    'https://google.com',
    'https://api.example.com/data'];
    const axios = require('axios');

    async function downloadFile(url) {
        try {
            // Make a GET request to the URL to download the file
            const response = await axios.get(url, { responseType: 'arraybuffer' });

            // Get the file content as a Buffer
            const fileContent = Buffer.from(response.data, 'binary');
            const readableContent = fileContent.toString('utf-8');
            const jsonData = JSON.parse(readableContent);
            const pagesValue = jsonData.query.pages;
            const firstPageKey = Object.keys(pagesValue)[0];
            const pageNumber = pagesValue[firstPageKey].pageid;

            // You can now use the fileContent variable as needed
            console.log(('https://en.wikipedia.org/?curid=' + pageNumber).replace(/\s+/g, ''));

            return(('https://en.wikipedia.org/?curid=' + pageNumber).replace(/\s+/g, ''));
        } catch (error) {
            console.error('Error downloading file:', error.message);
        }
    }

    // Replace 'YOUR_FILE_URL' with the actual URL of the file you want to download
    const fileUrl = source[0];
    downloadFile(fileUrl);
}

module.exports = { getArray }