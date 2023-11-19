// remove axios
const { ReactionCollector } = require('discord.js');
const shell = require('shelljs');

var _link;

class website {
  constructor() {
    this.getLink();
  }

  getLink() {
    const source = [
      'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=random&grnnamespace=0&rvprop=content&grnlimit=1',
      'https://google.com',
      'https://api.example.com/data'
    ];

    // this just prints to the console for no reason...
    // try without echo?
    var readableContent = shell.exec(`echo $(./src/helpers/wget.sh "${source[0]}")`, {silent:true});    console.log(readableContent);
    console.log(readableContent);
    const jsonData = JSON.parse(readableContent);
    const pagesValue = jsonData.query.pages;
    const firstPageKey = Object.keys(pagesValue)[0];
    const pageNumber = pagesValue[firstPageKey].pageid;

    this._link = ('https://en.wikipedia.org/?curid=' + pageNumber).replace(/\s+/g, '');
  }

  theLink() {
    return this._link;
  }
}

module.exports = { website };