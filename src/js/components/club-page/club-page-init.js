import * as $ from 'jquery';
import { getData } from '../../api/api.js';
import { templates } from '../../templates/templates.js';
import { parseGets } from '../helpers';
import { getMatchResultIcon } from '../match-page/match-helpers.js';

export class ClubPageInit {
   constructor() {
      this.$clubContentBlock = $('#club-content');

      if (this.$clubContentBlock.length === 0) {
         return false;
      }
      this.$clubesTabs = this.$clubContentBlock.find('.section-tabs .item');
      this.$clubesPageTabs = this.$clubContentBlock.find('.section-tab-page');
      this.clubId = this.$clubContentBlock.attr('data-club-id');

      this.loadedData = {
         info: null,
         overview: null,
         team: null,
         fixtures: null,
         stats: null,
      };

      this.fixturesTournament = $('#club-fixtures-tournament').val();
      this.fixturesSeason = $('#club-fixtures-season').val();
      this.fixturesPage = 0;
      this.isFixturesLast = false;
      this.isFixturesLoading = false;

      this.init();
   }

   init = () => {
      this.getCurrentTabData('info');

      this.initActiveTab();

      this.$clubesTabs.on('click', this.changeClubTab);

      $('#club-fixtures-tournament').on('change', this.changeTournament);
      $('#club-fixtures-season').on('change', this.changeSeason);
      $(window).on('scroll', this.onScroll);
   };

   addLoader = () => {
      if (this.$clubContentBlock.find('.section-content-wrap .loader-full-page').length === 0) {
         this.$clubContentBlock.find('.section-content-wrap').append(`
              <div class="loader-full-page">
                  <div class="loader-wrap">
                     <div class="loader"></div>
                 </div>
              </div>
            `);
      }
   };
   removeLoader = () => {
      if (this.$clubContentBlock.find('.section-content-wrap .loader-full-page').length > 0) {
         this.$clubContentBlock.find('.section-content-wrap .loader-full-page').remove();
      }
   };

   /**
    * Смена турнира
    */
   changeTournament = (e) => {
      this.fixturesTournament = $(e.currentTarget).val();

      this.clearMatchFixtures();
      this.getFixturesMatches();
   };
   /**
    * Смена сезона
    */
   changeSeason = (e) => {
      this.fixturesSeason = $(e.currentTarget).val();

      this.clearMatchFixtures();
      this.getFixturesMatches();
   };

   /**
    * Очистка данных о текущей странице, загрузке при смене сезона или турнира
    */
   clearMatchFixtures = () => {
      $('#club-fixtures-matches').html('');
      this.fixturesPage = 0;
      this.isFixturesLast = false;
      this.isFixturesLoading = false;
   };

   /**
    * Находим активный таб - либо как гет параметр, либо класс active
    */
   initActiveTab = () => {
      this.activeTab = parseGets().tab;
      let tab = '';
      if (this.activeTab) {
         tab = this.activeTab;
      } else {
         tab = this.$clubContentBlock.find('.section-tabs .item.active').attr('data-club-tab');
      }

      if (tab === undefined) {
         tab = 'overview';
      }

      this.getCurrentTabData(tab);
      this.setClubTab(tab);
   };

   /**
    * Загружаем данные активного таба
    */
   getCurrentTabData = async (tab) => {
      if (!this.loadedData[tab]) {
         this.addLoader();
         if (tab === 'fixtures') {
            this.getFixturesMatches();
         } else {
            this.loadedData[tab] = await getData({ uri: 'clubs', body: { action:'getClub', id: this.clubId, type: tab } });
         }

         this.getTabBlocks(tab);
         this.currentTab = tab;

         this.removeLoader();
      }
   };
   /**
    * Подгрузка матчей при скроле
    */
   onScroll = () => {
      if ($(window).scrollTop() === $(document).height() - $(window).height()) {
         if (!this.isFixturesLast && !this.isFixturesLoading && this.currentTab === 'fixtures') {
            this.getFixturesMatches();
         }
      }
   };
   /**
    * Функция загрузки матчей
    */
   getFixturesMatches = async () => {
      this.isFixturesLoading = true;
      this.toggleLoader();
      let data = await getData({
         uri: 'clubs',
         body: {
            action: 'getClubMatches',
            tournament: this.fixturesTournament,
            season: this.fixturesSeason,
            page: this.fixturesPage + 1,
         },
      });

      if (!data) {
         this.isFixturesLast = true;
      } else {
         this.getMatchesTemplate(data.matches);
         this.fixturesPage += 1;
      }
      this.toggleLoader();
      this.isFixturesLoading = false;
   };
   /**
    * Получаем шаблоны полученных матчей
    */
   getMatchesTemplate = (data) => {
      let matchesTemplate = ``;
      let prevDate = ``;

      for (let i = 0; i < data.length; i++) {
         matchesTemplate += templates.getMatchesDate(data[i], prevDate, true);
         matchesTemplate += templates.getMatchTemplate(data[i]);
      }

      $('#club-fixtures-matches').append(matchesTemplate);
   };
   /**
    * Показ скрытие прелоадера для матчей
    */
   toggleLoader = () => {
      if ($('#club-fixtures').find('.loader-wrap').length > 0) {
         $('#club-fixtures').find('.loader-wrap').remove();
      } else {
         $('#club-fixtures').append('<div class="loader-wrap"><div class="loader"></div></div>');
      }
   };

   /**
    * Согласно выбранного таба - заполняем блоки в нужной вкладке
    */
   getTabBlocks = (tab) => {
      switch (tab) {
         case 'overview':
            this.initOverviewTab(tab);
            break;
         case 'team':
            this.initTeamTab(tab);
            break;
         case 'stats':
            this.initStatsTab(tab);
            break;
         default:
            break;
      }
   };

   /**
    * Изменение таба по клику
    */
   changeClubTab = (e) => {
      e.preventDefault();

      let tab = $(e.currentTarget).attr('data-club-tab');
      this.activeTab = tab;

      this.getCurrentTabData(tab);
      this.setClubTab(tab);
   };

   /**
    * Установка классов активному табу
    */
   setClubTab = (tab) => {
      this.$clubesTabs.removeClass('active');
      this.$clubesPageTabs.removeClass('active');
      if (tab === undefined) {
         tab = this.$clubContentBlock.find('[data-club-tab]').first().attr('data-club-tab');
      }

      this.$clubContentBlock.find('[data-club-tab="' + tab + '"]').addClass('active');
   };

   /**
    * Overview таб
    */
   initOverviewTab = (tab) => {
      let data = this.loadedData[tab];

      this.initClubForm(data.lastMatches);
      this.initClubScorers(data.scorers);
      this.initClubNews(data.news);
      this.initClubMedia(data);
      this.initClubInfo(this.loadedData.info);
   };
   /**
    * Последние матчи команды
    */
   initClubForm = (data) => {
      let template = ``;

      for (let i = 0; i < data.length; i++) {
         let icon = getMatchResultIcon(data[i].result);
         template += templates.getH2hDropDownItem(data[i], icon);
      }

      $('#club-form-list').html(template);
   };
   /**
    * Бомбардиры команды
    */
   initClubScorers = (data) => {
      let template = ``;

      for (let i = 0; i < data.length; i++) {
         template += templates.getScorersItem(data[i], this.loadedData.info.img);
      }

      $('#club-scorers-rows').html(template);
   };

   /**
    * Новости команды
    */
   initClubNews = (data) => {
      let template = ``;

      for (let i = 0; i < data.length; i++) {
         template += templates.getNewsItem(data[i], i);
      }

      $('#club-news-list').html(template);
   };
   /**
    * Медиа команды
    */
   initClubMedia = (data) => {
      let video = this.getMediaTemplates(data.video);
      let photo = this.getMediaTemplates(data.photo);
      let latestMedia = this.getMediaTemplates(data.latest_media);

      $('#club-video').html(video);
      $('#club-photo').html(photo);
      $('#club-all-media').html(latestMedia);
   };

   /**
    * Медиа команды формирование списка
    */
   getMediaTemplates = (data) => {
      let template = ``;

      for (let i = 0; i < data.length; i++) {
         template += templates.getMediaItem(data[i], i);
      }

      return template;
   };
   /**
    * Инфо команды
    */
   initClubInfo = (data) => {
      let template = templates.getClubInfo(data);

      $('#club-info-block').html(template);
   };

   /**
    * Таб игроков и персонала
    */
   initTeamTab = (tab) => {
      let data = this.loadedData[tab];

      let forwards = this.initTeamByCategory(data.forwards);
      let midfielders = this.initTeamByCategory(data.midfielders);
      let defenders = this.initTeamByCategory(data.defenders);
      let goalkeepers = this.initTeamByCategory(data.goalkeepers);
      let coach = this.initTeamByCategory(data.coach);
      let staff = this.initTeamByCategory(data.staff);

      $('#club-team-forwards').html(forwards);
      $('#club-team-midfielders').html(midfielders);
      $('#club-team-defenders').html(defenders);
      $('#club-team-goalkeepers').html(goalkeepers);
      $('#club-team-coach').html(coach);
      $('#club-team-staff').html(staff);
   };
   /**
    * Формирование списка игроков или персонала по категории
    */
   initTeamByCategory = (data) => {
      let template = ``;

      for (let i = 0; i < data.length; i++) {
         if (data[i].amplua) {
            template += templates.getPlayerItem(data[i]);
         } else {
            template += templates.getPlayerItem(data[i], true);
         }
      }

      return template;
   };

   /**
    * Таб статистики команды
    */
   initStatsTab = (tab) => {
      let data = this.loadedData[tab];

      this.initStatsMatches(data.matches);
      this.initStatsPlayers(data.players);
   };
   /**
    * Таб статистики - вкладка матчи
    */
   initStatsMatches = (data) => {
      for (let key in data) {
         let template = `<div class="match-stat section-block" id="stats-matches-games">`;

         for (let i = 0; i < data[key].length; i++) {
            template += templates.getClubStatsItem(data[key][i]);
         }

         template += `</div>`;

         $('#club-stats-matches').append(template);
      }
   };

   /**
    * Таб статистики - вкладка игроки
    */
   initStatsPlayers = (data) => {
      for (let key in data) {
         let template = ``;

         for (let i = 0; i < data[key].length; i++) {
            template += templates.getClubStatsPlayerItem(data[key][i], this.loadedData.info.img);
         }

         $('#stats-' + key)
            .find('.players-list')
            .html(template);
      }
   };
}
