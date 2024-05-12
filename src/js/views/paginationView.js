import View from './view.js';
import icons from 'url:../../img/icons.svg'; // new method to import images and url in parcel .

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const gotopage = +btn.dataset.goto;

      handler(gotopage);
    });
  }

  _generateMarkupButton(nav) {
    return nav === `next`
      ? `<button data-goto="${
          this._data.page + 1
        }" class="btn--inline pagination__btn--next">
             <span>Page ${this._data.page + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
        </button>`
      : `<button data-goto="${
          this._data.page - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
                <span>Page ${this._data.page - 1}</span>
        </button> `;
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsByPage
    );
    console.log(`number of pages : ${numPages}`);

    //page 1 ,and there are  other pages
    if (currentPage === 1 && numPages > 1) {
      return this._generateMarkupButton('next');
    }
    //last page
    if (currentPage === numPages && numPages > 1) {
      return this._generateMarkupButton('prev');
    }
    //other page
    if (currentPage < numPages) {
      return `${this._generateMarkupButton('prev')}
        ${this._generateMarkupButton('next')}`;
    }
    // page 1 ,and there are no other pages
    return ` `;
  }
}

export default new PaginationView();
