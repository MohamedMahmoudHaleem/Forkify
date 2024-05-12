import icons from 'url:../../img/icons.svg'; // new method to import images and url in parcel .

import previewView from './previewView.js';
import View from './view';
class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `no recipe found for your query , please try another one `;
  _message = ``;

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultView();
