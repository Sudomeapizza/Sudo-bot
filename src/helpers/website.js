const axios = require('axios');

class getLink {
    constructor() {
        const source = ['https://en.wikipedia.org/w/api.php?format=json&action=query&generator=random&grnnamespace=0&rvprop=content&grnlimit=1',
            'https://google.com',
            'https://api.example.com/data'];

        async function downloadFile(url) {
            try {
                // Make a GET request to the URL to download the file
                const response = await axios.get(url, { responseType: 'arraybuffer' });
                // const response = axios.get(url);
                // Get the file content as a Buffer
                const fileContent = Buffer.from(response.data, 'binary');
                const readableContent = fileContent.toString('utf-8');
                const jsonData = JSON.parse(readableContent);
                const pagesValue = jsonData.query.pages;
                const firstPageKey = Object.keys(pagesValue)[0];
                const pageNumber = pagesValue[firstPageKey].pageid;

                // You can now use the fileContent variable as needed
                console.log("__" + ('https://en.wikipedia.org/?curid=' + pageNumber).replace(/\s+/g, ''));

                return (('https://en.wikipedia.org/?curid=' + pageNumber).replace(/\s+/g, ''));
            } catch (error) {
                console.error('Error downloading file:', error.message);
            }
        }

        // Replace 'YOUR_FILE_URL' with the actual URL of the file you want to download
        this.fileUrl = source[0];
        return downloadFile(this.fileUrl);
    }
}

module.exports = { getLink };