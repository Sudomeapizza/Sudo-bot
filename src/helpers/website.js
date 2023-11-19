// remove axios
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

    shell.exec(`echo "tada"`, { stdio: [] })
    var readableContent = shell.exec(`echo $(./src/helpers/wget.sh "${source[0]}")`);
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