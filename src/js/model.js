import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { API_URl, KEY, RES_PER_PAGE } from './config.js';
// import { getJson, sendJson } from './helpers.js';
import { Ajax } from './helpers.js';
// import recipeView from './views/recipeView.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsByPage: RES_PER_PAGE,
  },
  bookmarks: [],
};
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    sourceUrl: recipe.source_url,
    publisher: recipe.publisher,
    servings: recipe.servings,
    image: recipe.image_url,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await Ajax(`${API_URl}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(`${err}💣💣💣💣💣`);
    throw err;
  }
};
export const loadSerchResult = async function (query) {
  try {
    state.search.query = query;
    const data = await Ajax(`${API_URl}?search=${query}&key=${KEY}`);
    console.log(data);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        servings: rec.servings,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    //reset page number
    state.search.page = 1;
  } catch (err) {
    console.error(`${err}💣💣💣💣💣`);
    throw err;
  }
};
// loadSerchResult('pizza');
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  console.log(page);
  const start = (page - 1) * state.search.resultsByPage; //0
  const end = page * state.search.resultsByPage; //10
  console.log(start, end);
  return state.search.results.slice(start, end);
};
export const updateServings = function (newServings) {
  //update recipes ingredients

  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  //update servings in the state
  state.recipe.servings = newServings;
};
const presistBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
export const addBookmark = function (recipe) {
  // add bookmarks
  state.bookmarks.push(recipe);

  // mark current recipes as bookmarks
  //allow to display the current recipe as bookmarked in the recipe view
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  presistBookmark();
};
export const deleteBookmark = function (id) {
  //delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // mark current recipe as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  presistBookmark();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookMarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookMarks();
export const uploadRecipe = async function (newRecipe) {
  try {
    console.log(newRecipe);
    console.log(Object.entries(newRecipe));
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error('Wrong Ingredients , Enter  Fromat Correctly please');
        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    // console.log(recipe);
    const data = await Ajax(`${API_URl}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
    console.log('resposne : ', data);
  } catch (err) {
    throw err;
  }
};
