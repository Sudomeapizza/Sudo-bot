const { google } = require('googleapis');
const cheerio = require('cheerio');
const shell = require('shelljs');
require('dotenv').config();
const { googleAPI } = process.env;

var _link = "blankk";

class website {
    constructor() {
        console.log("Workie13");
        this.fetchLink();
    }

    fetchLink() {
        const source = [
            'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=random&grnnamespace=0&rvprop=content&grnlimit=1',
            'https://google.com',
            'https://api.example.com/data'
        ];

        var readableContent = shell.exec(`echo $(./src/helpers/wget.sh "${source[0]}")`, { silent: true });
        const jsonData = JSON.parse(readableContent);
        const pagesValue = jsonData.query.pages;
        const firstPageKey = Object.keys(pagesValue)[0];
        const pageNumber = pagesValue[firstPageKey].pageid;

        this._link = ('https://en.wikipedia.org/?curid=' + pageNumber).replace(/\s+/g, '');
    }

    theLink() {
        console.log("Workie14");
        return this._link;
    }
}

async function fetchFavicon(baseUrl) {
    try {

        if (baseUrl.substring(0, 19) === "https://xcancel.com")
            return `https://xcancel.com/logo.png`

        if (baseUrl.substring(0, 13) === "https://x.com")
            return `https://xcancel.com/logo.png`

        const res = await fetch(baseUrl);
        if (!res.ok) return `${baseUrl}favicon.ico`;

        const html = await res.text();
        const $ = cheerio.load(html);

        // Find all <link rel="..."> that contain "icon"
        let iconHref = $('link[rel*="icon"]').attr("href");

        if (!iconHref) {
            // fallback to common default
            return new URL("/favicon.ico", baseUrl).href;
        }

        // Normalize to absolute URL
        if (iconHref.startsWith("http")) return iconHref;
        return new URL(iconHref, baseUrl).href;

    } catch (err) {
        console.error("fetchFavicon failed:", err);
        return new URL("/favicon.ico", baseUrl).href;
    }
}

async function getVideoDetails(videoId) {
    const youtube = google.youtube({
        version: 'v3',
        auth: googleAPI, // Replace with your actual API key
    });

    try {
        const response = await youtube.videos.list({
            part: 'snippet',
            id: videoId,
        });

        const video = response.data.items[0];




        if (video) {
            return {
                ok: true,
                title: video.snippet.title,
                description: video.snippet.description
            }
        } else {
            return {
                ok: false,
                title: "Video not found",
                description: "Video not found"
            }
        }
    } catch (error) {
        return {
            success: false,
            title: 'Error fetching video details:', error
        }
        console.error('Error fetching video details:', error);
    }
}

module.exports = { website, getVideoDetails, fetchFavicon };
