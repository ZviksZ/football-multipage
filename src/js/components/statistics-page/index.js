import * as $ from 'jquery';
import { getData } from '../../api/api.js';
import { templates } from '../../templates/templates.js';

export class StatisticsPage {
   constructor() {
      this.$section = $('#statistics-page');
      if (this.$section.length === 0) return false;

      this.$seasonSelect = $('#statistics-season-select');
      this.$clubSelect = $('#statistics-clubs-select');
      this.$sectionTabs = this.$section.find('.section-tabs');

      this.isLoaded = {
         players: false,
         clubs: false
      }

      this.init();
   }
   init = () => {
      this.getData();

      this.$section.find('#scroll-filter-btn').on('click', this.openFilter);
      this.$section.find('#scroll-filter .close-btn').on('click', this.closeFilter);
      this.$section.find('select').on('change', this.initSelectChange);
      this.$sectionTabs.find('.item').on('click', this.changeTab);
   };

   openFilter = () => {
      $('body').addClass('show-scroll-filter');
   };
   closeFilter = () => {
      $('body').removeClass('show-scroll-filter');
   };

   changeTab = (e) => {
      let currentTab = $(e.currentTarget).attr('data-stats-tab');
      this.$sectionTabs.find('.item').removeClass('active');
      this.$section.find('.section-tab-page').removeClass('active');

      this.$sectionTabs.find('.item[data-stats-tab="' + currentTab + '"]').addClass('active');
      this.$section.find('.section-tab-page[data-stats-tab="' + currentTab + '"]').addClass('active');

      if (!this.isLoaded[currentTab]) {
         this.getData();
      } else {
         this.$section.find('.section-block').removeClass('hide');
      }


   };

   initSelectChange = (e) => {
      this.isLoaded = {
         players: false,
         clubs: false
      }

      this.getData();
   };

   getData = async () => {
      this.addLoader();

      this.$section.find('.section-block').addClass('hide');

      this.currentType = this.$sectionTabs.find('.item.active').attr('data-stats-tab');

      this.loadedData = await getData({
         uri: 'getStatistics',
         body: {
            season: this.$seasonSelect.val(),
            club: this.$clubSelect.val(),
            type: this.currentType,
         },
      });

      this.getDateTemplates();
      this.removeLoader();
   };

   getDateTemplates = () => {
      let data = this.loadedData;

      for (let key in data) {
         let template = ``;
         for (let i = 0; i < data[key].length; i++) {
            if (this.currentType === 'players') {
               template += templates.getPlayerStatisticsItem(data[key][i]);
            } else {
               template += templates.getClubStatisticsItem(data[key][i]);
            }
         }
         $('#statistics-' + this.currentType + '-' + key)
            .removeClass('hide')
            .find('.statistics-list')
            .html(template);
      }

      this.isLoaded[this.currentType] = true
   };

   addLoader = () => {
      this.isLoading = true;

      if (this.$section.find('.section-content-wrap .loader-wrap').length === 0) {
         this.$section.find('.section-content-wrap').append(`
               <div class="loader-wrap">
                  <div class="loader"></div>
              </div>
            `);
      }
   };
   removeLoader = () => {
      this.isLoading = false;
      if (this.$section.find('.section-content-wrap .loader-wrap').length > 0) {
         this.$section.find('.section-content-wrap .loader-wrap').remove();
      }
   };
}
