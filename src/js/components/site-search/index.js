import * as $                from 'jquery';
import { getData }           from '../../api/api.js';
import { templates }         from '../../templates/templates.js';
import { highlightSomeText } from '../helpers';

export class SiteSearch {
   constructor() {
      this.$body = $('body');

      this.$searchOpenBtn = $('#header__search-btn');
      this.$searchCloseBtn = $('#header__search-close');
      this.$searchInput = $('#header__search-input');
      this.$searchResults = $('#header__search-results');

      this.init();
   }

   init = () => {
      this.$searchOpenBtn.on('click', this.openSearch);
      this.$searchCloseBtn.on('click', this.closeSearch);
      this.$searchInput.on('input', this.getQueryResults);
   };

   openSearch = (e) => {
      e.preventDefault();

      this.$body.addClass('search-open');
   };

   closeSearch = (e) => {
      e.preventDefault();

      this.$body.removeClass('search-open');
   };

   getQueryResults = async (e) => {
      this.query = $(e.currentTarget).val();

      if (this.query.length) {
         this.toggleLoader();
         this.responseData = await getData({ uri: 'getSearch', body: { query: this.query } });

         if ($.isEmptyObject(this.responseData)) {
            this.$searchResults.html('<p class="no-results">No result</p>');
         } else {
            this.getResultsTemplates();
         }
      } else {
         this.$searchResults.html(``);
      }
   };

   getResultsTemplates = () => {
      let resultHtml = ``;

      Object.keys(this.responseData).map((key) => {
         resultHtml += templates.getSectionTitle(key);

         for (let i = 0; i < this.responseData[key].length; i++) {
            let item = this.responseData[key][i];

            switch (key) {
               case 'players':
                  resultHtml += templates.getPlayerItem(item);
                  break;
               case 'news':
                  resultHtml += templates.getNews(item);
                  break;
               case 'clubs':
                  resultHtml += templates.getClubItem(item);
                  break;
               default:
                  break;
            }
         }
      });

      this.$searchResults.html(resultHtml);

      highlightSomeText(this.query, document.getElementById('header__search-results'));
   };

   toggleLoader = () => {
      if (this.$searchResults.find('.loader-wrap').length > 0) {
         this.$searchResults.find('.loader-wrap').remove();
      } else {
         this.$searchResults.html('<div class="loader-wrap"><div class="loader"></div></div>');
      }
   }

}
