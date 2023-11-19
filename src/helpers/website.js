// remove axios
const { ReactionCollector } = require('discord.js');
const shell = require('shelljs');

var _link;

class website {
  constructor() {
    console.log("Workie13");
    this.getLink();
  }

  getLink() {
    const source = [
      'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=random&grnnamespace=0&rvprop=content&grnlimit=1',
      'https://google.com',
      'https://api.example.com/data'
    ];

    // fixed the console readout, but now it sends a broken message...
    var readableContent = shell.exec(`echo $(./src/helpers/wget.sh "${source[0]}")`, {silent:true});
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

module.exports = { website };