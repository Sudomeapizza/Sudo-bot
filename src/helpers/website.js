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
    console.log(0);
    var readableContent = shell.exec(`echo $(./src/helpers/wget.sh "${source[0]}", )`, {silent:true});
    // var readableContent = shell.exec(`$(./src/helpers/wget.sh "${source[0]}")`);
    console.log(readableContent);
    console.log(1);
    const jsonData = JSON.parse(readableContent);
    console.log(2);
    const pagesValue = jsonData.query.pages;
    console.log(3);
    const firstPageKey = Object.keys(pagesValue)[0];
    console.log(4);
    const pageNumber = pagesValue[firstPageKey].pageid;
    console.log(5);

    this._link = ('https://en.wikipedia.org/?curid=' + pageNumber).replace(/\s+/g, '');
  }

  theLink() {
    return this._link;
  }
}

module.exports = { website };