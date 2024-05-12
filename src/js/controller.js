import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import serchView from './views/searchView.js';
import resultView from './views/resultView.js';
import addRecipe from './views/addRecipeView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';

// if (model.hot) {
//   model.hot.accept();
// }
const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  // recipeView.renderSpiner(recipeContainer);
  try {
    const id = window.location.hash.slice(1);
    //render spiner

    if (!id) return;
    recipeView.renderSpiner();

    //0)update results view to mark selected search result.
    resultView.update(model.getSearchResultsPage());

    //1) updating bookmarks view .
    bookmarksView.update(model.state.bookmarks);

    //2)Loading Recipes
    // model file deal with  http req
    await model.loadRecipe(id); //calling async fun

    //3)rendering recipes
    recipeView.render(model.state.recipe);
  } catch (err) {
    // console.error(err);
    recipeView.renderError();
    bookmarksView.renderError();
    console.error(err);
  }
};
const controlSerchResult = async function () {
  try {
    resultView.renderSpiner();

    // 1)get Search query
    const query = serchView.getQuery();
    if (!query) return;

    // 2)load search query Results
    await model.loadSerchResult(query);

    // console.log(model.state.search.results);

    // 3) Render Results .
    // resultView.render(model.state.search.results);
    resultView.render(model.getSearchResultsPage());

    // 4) Render Intial pangitaions
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
//using buttons to navigate in search list
const controllPagination = function (pageNum) {
  console.log(pageNum);
  //1) render new results
  resultView.render(model.getSearchResultsPage(pageNum));
  // 2) Render new pangitaions buttons
  paginationView.render(model.state.search);
};
const controlServings = function (newServings) {
  //update servings in state
  model.updateServings(newServings);

  //update  recipes view
  // recipeView.render(model.state.recipe);
  //will update only text and attributes in the Dom , without having to render the entire view
  recipeView.update(model.state.recipe);
};
//controller adding a new bookMark .
const controlAddBookMark = function () {
  //1) add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2)update recipes View
  recipeView.update(model.state.recipe);

  //3)render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  //upload the new recipes data.
  try {
    //loading spinder
    addRecipe.renderSpiner();

    //upload recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //seucess message
    addRecipe.renderMessage();

    //Render bookmarks view
    bookmarksView.render(model.state.bookmarks);

    //change id in the url - change the id with our reload the page .
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //close form window
    setTimeout(() => {
      addRecipe._toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipe.renderError(err.message);
  }
};
function init() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandleRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookMark);
  serchView.addHandlerSearch(controlSerchResult);
  paginationView.addHandlerClick(controllPagination);
  addRecipe.addHandlerUpload(controlAddRecipe);
  alert('HACKED');
}
init();
