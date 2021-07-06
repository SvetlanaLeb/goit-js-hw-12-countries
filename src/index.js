import articleTpl from './templates/article.hbs';
import listTpl from './templates/countries.hbs';
import './common.css';
import CountryApiService from './js/fetchCountries';
import { Spinner } from 'spin.js';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

import { create } from 'lodash';
const opts = {
  lines: 10, // The number of lines to draw
  length: 38, // The length of each line
  width: 13, // The line thickness
  radius: 50, // The radius of the inner circle
  scale: 0.8, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#5f656b', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  top: '50%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  zIndex: 2000000000, // The z-index (defaults to 2e9)
  className: 'spinner', // The CSS class to assign to the spinner
  position: 'absolute', // Element positioning
};

const tsf = {
  text: "Too many matches found. Please enter a more specific query!",
  duration: 1000,
  destination: "https://github.com/apvarun/toastify-js",
  newWindow: true,
  close: true,
  gravity: "top", // `top` or `bottom`
  position: "right", // `left`, `center` or `right`
  backgroundColor: "linear-gradient(to right, crimson, rgb(252, 128, 152))",
  stopOnFocus: true, // Prevents dismissing of toast on hover
  onClick: function () { }, // Callback after click
  className:"notification"
}

const refs = {
  input: document.querySelector('.form-control'),
  articleContainer: document.querySelector('.article-container'),
  countriesList: document.querySelector('.countries-list'),
  wrapper: document.querySelector('.wrapper')
};
const countryApiService = new CountryApiService();

const spinner = new Spinner(opts);
  
const debounce = require('lodash.debounce');
const d= debounce(onInputChange, 500)
refs.input.addEventListener('input', d);

function onInputChange(e) {
  countryApiService.searchQuery = e.target.value;
  spinner.spin((refs.wrapper));

  if (countryApiService.searchQuery) {
    countryApiService.fetchCountries().then((data) => {
      clearArticleContainer();
      spinner.stop();
      if (data.length === 1) {
        const country = data[0];
        return appendArticleMarkup(country)
      };

      if (data.length > 1 && data.length < 11) {
        data.forEach(elm => {
          return appendCountriesList(elm.name)
        })
      };

      if (data.length > 10) {
        
        clearArticleContainer();
        Toastify(tsf).showToast();
      };

      if (data.status === 404) {
      
        Toastify({ ...tsf, text:"Invalid input. Nothing found. Try again!" }).showToast();
    }
    })
  };

  if (e.target.value === '') {
    clearArticleContainer()
  }

    
};

function appendArticleMarkup( country ) {
  refs.articleContainer.insertAdjacentHTML('beforeend', articleTpl(country));
};

function appendCountriesList(country) {
  
  refs.countriesList.insertAdjacentHTML('beforeend', listTpl(country));

}
 function clearArticleContainer() {
   refs.articleContainer.innerHTML = '';
   refs.countriesList.innerHTML = '';
   spinner.stop();
}
