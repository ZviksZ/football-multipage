import * as $ from 'jquery';
import { getData } from '../../api/api.js';
import { templates } from '../../templates/templates.js';
import { CustomSelect } from '../custom-select';
import { highlightSomeText } from '../helpers';

export class ScrollLoadSection {
   constructor() {
      this.$section = $('#scroll-load-section');

      if (this.$section.length === 0) {
         return false;
      }

      this.dataAjax = this.$section.attr('data-ajax');
      this.currentPage = 0;
      this.isLast = false;
      this.isLoading = false;
      this.query = '';
      this.isFirstLoad = true;
      this.matchesSeason = '';

      this.init();
   }

   init = () => {
      this.initCurrentPage();
      this.getPageData();

      $(window).on('scroll', this.onScroll);

      this.$section.find('#scroll-search').on('input', this.initSearch);
      this.$section.find('#scroll-filter-btn').on('click', this.openFilter);
      this.$section.find('#scroll-filter .close-btn').on('click', this.closeFilter);
      this.$section.find('select').on('change', this.initSelectChange);
   };

   openFilter = () => {
      $('body').addClass('show-scroll-filter');
   };
   closeFilter = () => {
      $('body').removeClass('show-scroll-filter');
   };

   initCurrentPage = () => {
      switch (this.dataAjax) {
         case 'news':
            this.initNewsPage();
            break;
         case 'getClubs':
            break;
            break;
         default:
            break;
      }
   };
   initMatchesPage = (data) => {
      this.initMatchesSeasonsSelect(data.seasons);
      this.initMatchesClubsSelect(data.clubs);

      new CustomSelect();
   };
   initMatchesSeasonsSelect = (data) => {
      let seasons = ``;

      for (let i = 0; i < data.length; i++) {
         seasons += `<option value="${data[i].id}">Season ${data[i].name}</option>`;
      }

      this.$section.find('#fixtures-season-select').html(seasons);
   };
   initMatchesClubsSelect = (data) => {
      let clubs = ``;

      for (let j = 0; j < Object.keys(data).length; j++) {
         let key = Object.keys(data)[j]
         if (data[key].id == 'all') {
            clubs += `<option value="${data[key].id}" selected>${data[key].name}</option>`;
         } else {
            clubs += `<option value="${data[key].id}">${data[key].name}</option>`;
         }
      }

      if( this.$section.find('#fixtures-clubs-select').length > 0) {
         this.$section.find('#fixtures-clubs-select').html(clubs);
      } else {
         this.$section.find('.section-title.with-double-select').prepend(`
               <select class="custom-select loaded-select" name="" id="fixtures-clubs-select" multiple=""></select>
         `);
         this.$section.find('#fixtures-clubs-select').html(clubs);
      }
   };

   initSelectChange = (e) => {
      this.$section.find('.section-content-wrap .section-block').html('');
      this.currentPage = 0;
      this.isLast = false;

      this.getPageData();
   };

   initSearch = (e) => {
      this.query = $(e.currentTarget).val();
      this.$section.find('.section-content-wrap .section-block').html('');
      this.currentPage = 0;
      this.isLast = false;

      this.getPageData();
   };

   onScroll = () => {
      if ($(window).scrollTop() + $(window).height() >= $(document).height() - 200) {
         if (!this.isLast && !this.isLoading) {
            this.getPageData();
         }
      }
   };

   getPageData = async () => {
      let body = this.getPageBody();
      let currentSeason = '';
      if (this.dataAjax === 'matches') {
         currentSeason = this.$section.find('#fixtures-season-select').val()
      }
      this.addLoader();

      let data = await getData({ uri: this.dataAjax, body });

      if (data && this.dataAjax === 'matches' && this.isFirstLoad) {
         this.initMatchesPage(data);
         this.isFirstLoad = false;
         this.matchesSeason = currentSeason
      }
      if (data && this.dataAjax === 'matches' && (currentSeason !== this.matchesSeason)) {
         this.$section.find('#fixtures-clubs-select').closest('.choices.choices-custom').remove()
         this.initMatchesClubsSelect(data.clubs);
         new CustomSelect();
         this.matchesSeason = currentSeason
      }

      if (!data) {
         this.isLast = true;
      } else {
         this.currentPage += 1;
         this.appendDataTemplates(data);
      }

      if (this.query.length > 0) {
         highlightSomeText(this.query, document.querySelector('#scroll-load-section .section-content-wrap'));
      }

      this.removeLoader();
   };

   getPageBody = () => {
      let body = {};
      switch (this.dataAjax) {
         case 'news':
            body = {
               ajaxAction: 'typeNews',
               page: this.currentPage + 1,
               type: this.$section.find('.section-tabs .item.active').attr('data-tab'),
            };
            break;
         case 'clubs':
            body = {
               action: 'getClubs',
               page: this.currentPage + 1,
               query: this.$section.find('#scroll-search').val(),
               season: this.$section.find('#clubs-season-select').val(),
            };
            break;
         case 'players':
            body = {
               action: 'getPlayers',
               page: this.currentPage + 1,
               query: this.$section.find('#scroll-search').val(),
               league: this.$section.find('#players-league-select').val(),
               season: this.$section.find('#players-season-select').val(),
               position: this.$section.find('#players-position-select').val(),
               participations: this.$section.find('#players-participations-select').val(),
            };
            break;
         case 'referees':
            body = {
               action: 'getReferees',
               page: this.currentPage + 1,
            };
            break;
         case 'getEntries':
         case 'getWithdrawal':
            body = {
               page: this.currentPage + 1,
               query: this.$section.find('#scroll-search').val(),
            };
            break;
         case 'matches':
            body = {
               action: 'getFixtures',
               tournament: this.$section.attr('data-tournament'),
               matchday: this.currentPage + 1,
               club: this.$section.find('#fixtures-clubs-select').val(),
               season: this.$section.find('#fixtures-season-select').val(),
            };
            break;
         case 'getStatisticsFull':
            body = {
               season: this.$section.find('#statistics-season-select').val(),
               club: this.$section.find('#statistics-clubs-select').val(),
               type: this.$section.attr('data-type'),
               stat: this.$section.attr('data-stat'),
               page: this.currentPage + 1,
            };
            break;
         default:
            break;
      }

      return body;
   };

   appendDataTemplates = (data) => {
      let template;
      switch (this.dataAjax) {
         case 'news':
            template = this.appendNewsTemplates(data);
            break;
         case 'clubs':
            template = this.appendClubsTemplates(data);
            break;
         case 'players':
         case 'getEntries':
         case 'getWithdrawal':
            template = this.appendPlayersTemplates(data);
            break;
         case 'referees':
            template = this.appendRefereesTemplates(data);
            break;
         case 'matches':
         case 'getYouthFixtures':
            template = this.appendFixturesTemplates(data.matches);
            break;
         case 'getStatisticsFull':
            template = this.appendStatisticsTemplates(data);
            break;
         default:
            break;
      }

      if (this.dataAjax === 'news') {
         this.$section.find('.custom-tabs__item.active').append(template);
      } else {
         this.$section.find('.section-content-wrap .section-block').append(template);
      }
   };

   addLoader = () => {
      this.isLoading = true;

      if (this.$section.find('.section-content-wrap .loader-wrap').length === 0) {
         this.$section.find('.section-content-wrap').append(`
               <div class="loader-wrap">
                  <div class="loader"></div>
                  <div class="caption">loading more content</div>
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

   initNewsPage = () => {
      this.$section.find('.section-tabs .item').on('click', (e) => {
         this.currentPage = 0;
         this.isLast = false;
         this.$section.find('.custom-tabs__item').html('');
         this.getPageData();
      });
   };

   appendNewsTemplates = (data) => {
      let template = ``;

      for (let i = 0; i < data.length; i++) {
         let index = i;
         if (this.currentPage !== 1) {
            index = i + 1;
         }
         template += templates.getNewsItem(data[i], index);
      }

      return template;
   };

   appendClubsTemplates = (data) => {
      let template = ``;

      for (let i = 0; i < data.length; i++) {
         template += templates.getClubItem(data[i], i);
      }

      return template;
   };

   appendPlayersTemplates = (data) => {
      let template = ``;

      for (let i = 0; i < data.length; i++) {
         template += templates.getPlayerItem(data[i]);
      }

      return template;
   };

   appendRefereesTemplates = (data) => {
      let template = ``;

      for (let i = 0; i < data.length; i++) {
         template += templates.getRefereesItem(data[i]);
      }

      return template;
   };

   appendFixturesTemplates = (data) => {
      let template = ``;
      let prevDate = ``;

      for (let i = 0; i < data.length; i++) {
         if (i === 0) {
            template += `<div class="match-day">Matchday ${this.currentPage}</div>`;
         }
         template += templates.getMatchesDate(data[i], prevDate, false);

         prevDate = data[i].date.split(' ')[0];
         template += templates.getMatchTemplate(data[i]);
      }

      return template;
   };

   appendStatisticsTemplates = (data) => {
      let template = ``;

      for (let i = 0; i < data.length; i++) {
         if (this.$section.attr('data-type') === 'players') {
            template += templates.getPlayerStatisticsItem(data[i], true);
         } else {
            template += templates.getClubStatisticsItem(data[i], true);
         }
      }

      return template;
   };
}
