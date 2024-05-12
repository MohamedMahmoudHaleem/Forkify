import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Rendter the received object to the DOM
   * @param {Object | Object[]} data the data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false , create markup sring instead of rendering the Dom
   * @returns {undefined | string} A markup string is returned if render = false
   * @this {Object} view instance
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    console.log(`render method`);
    this._data = data;
    const markUp = this._generateMarkup();
    if (!render) return markUp;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }
  update(data) {
    this._data = data;
    //need the enitre markup to compare it to the old markup (not render it just for compare)
    const newMarkUp = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkUp);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));
      //update changed text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log(newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }
      //update change attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
  renderSpiner() {
    const markup = `<div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    // if there is no message use default parameter .
    const markUp = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message} !</p>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }
  renderMessage(message = this._message) {
    const markUp = `<div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message} !</p>
    </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }
}
