// remove axios
// const { ReactionCollector } = require('discord.js');
const shell = require('shelljs');

class Website {
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

  static get theLink() {
    console.log("Workie14");
    return this._link;
  }
}

module.exports = { Website };
