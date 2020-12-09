import * as $ from 'jquery';
import { getData } from '../../api/api.js';
import { templates } from '../../templates/templates.js';
import { parseGets } from '../helpers';
import { ModalGallery } from '../modal-gallery';
import { getAmpluaId } from './match-helpers.js';

export class MatchPageInit {
   constructor() {
      this.$matchContentBlock = $('#match-content');

      if (this.$matchContentBlock.length === 0) {
         return false;
      }
      this.$matchesTabs = this.$matchContentBlock.find('.section-tabs .item');
      this.$matchesPageTabs = this.$matchContentBlock.find('.section-tab-page');
      this.matchId = this.$matchContentBlock.attr('data-match-id');

      this.loadedData = {
         info: null,
         events: null,
         stats: null,
         lineUps: null,
         media: null,
      };

      this.init();
   }

   init = () => {
      this.addLoader();
      this.initCommonMatchData();
      this.initActiveTab();

      this.$matchesTabs.on('click', this.changeMatchTab);
   };

   addLoader = () => {
      if (this.$matchContentBlock.find('.section-content-wrap .loader-full-page').length === 0) {
         this.$matchContentBlock.find('.section-content-wrap').append(`
              <div class="loader-full-page">
                  <div class="loader-wrap">
                     <div class="loader"></div>
                 </div>
              </div>
            `);
      }
   };
   removeLoader = () => {
      if (this.$matchContentBlock.find('.section-content-wrap .loader-full-page').length > 0) {
         this.$matchContentBlock.find('.section-content-wrap .loader-full-page').remove();
      }
   };

   /**
    * Загружаем стартовые данные о матче
    */
   initCommonMatchData = async () => {
      this.loadedData.info = await getData({ uri: 'matches', body: { id: this.matchId, type: 'info', action: 'getMatch' } });

      this.setPlayerOfMatch();
   };

   setPlayerOfMatch = () => {
      let template = templates.getPlayerOfMatch(this.loadedData.info.playerMatch);

      $('#match-events-player').html(template);
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
         tab = this.$matchContentBlock.find('.section-tabs .item.active').attr('data-match-tab');
      }

      if (tab === undefined) {
         tab = 'events';
      }

      this.getCurrentTabData(tab);
      this.setMatchTab(tab);
   };

   /**
    * Загружаем данные активного таба
    */
   getCurrentTabData = async (tab) => {
      if (!this.loadedData[tab]) {
         this.addLoader();
         this.loadedData[tab] = await getData({ uri: 'matches', body: { id: this.matchId, type: tab, action: 'getMatch' } });

         this.getTabBlocks(tab);

         this.removeLoader();
      }
   };

   /**
    * Согласно выбранного таба - заполняем блоки в нужной вкладке
    */
   getTabBlocks = (tab) => {
      switch (tab) {
         case 'events':
            this.initEventsTab();
            break;
         case 'stats':
            this.initStatsTab();
            break;
         case 'lineups':
            this.initLineupsTab();
            break;
         case 'media':
            this.initMediaTab();
            break;
         default:
            break;
      }
   };

   /**
    * Изменение таба по клику
    */
   changeMatchTab = (e) => {
      e.preventDefault();

      let tab = $(e.currentTarget).attr('data-match-tab');
      this.activeTab = tab;

      this.getCurrentTabData(tab);
      this.setMatchTab(tab);
   };

   /**
    * Установка классов активному табу
    */
   setMatchTab = (tab) => {
      this.$matchesTabs.removeClass('active');
      this.$matchesPageTabs.removeClass('active');
      if (tab === undefined) {
         tab = this.$matchContentBlock.find('[data-match-tab]').first().attr('data-match-tab');
      }

      this.$matchContentBlock.find('[data-match-tab="' + tab + '"]').addClass('active');
   };

   /**
    * Формирование событий матча
    */
   initEventsTab = () => {
      let data = this.loadedData['events'];
      let eventsBlock = this.$matchContentBlock.find('#match-events-list');
      let template = ``;

      for (let i = 0; i < data.length; i++) {
         let isAway = data[i].club && data[i].club == this.loadedData.info.club2 ? true : false;
         template += templates.getMatchEvent(data[i], i, isAway);
      }

      template += `<div class="stage">Матч начался</div>`;

      eventsBlock.html(template);
   };

   /**
    * Формирование таба статистики матча
    */
   initStatsTab = () => {
      let data = this.loadedData['stats'];

      data.matchStatistics && this.getMatchStats(data.matchStatistics);
      /* Скрыто до договоренности о полном функционале
      data.lastMatches && this.getMatchH2H(data.lastMatches);
      */
      data.personalMeetings && this.getMatchPersonalMeetings(data.personalMeetings);
      data.seasonFigures?.clubs && this.getMatchSeasonFigures(data.seasonFigures.clubs);
   };
   /**
    * Формирование статистики матча
    */
   getMatchStats = (data) => {
      let template = ``;

      for (let i = 0; i < data.length; i++) {
         template += templates.getMatchStats(data[i]);
      }

      $('#match-stats').html(template);
   };
   /**
    * Формирование последних матчей команд
    */
   getMatchH2H = (data) => {
      let template = ``;

      for (let i = 0; i < data.length; i++) {
         template += templates.getH2hDropDown(data[i]);
      }

      $('#match-h2h').html(template);

      this.initMatchH2HDropdown();
   };
   /**
    * Функционал выпадающего списка в H2H
    */
   initMatchH2HDropdown = () => {
      $('.match-h2h__dropdown .head').on('click', function (e) {
         $(e.currentTarget).closest('.match-h2h__dropdown').toggleClass('dropdown-open');
      });
   };
   /**
    * Формирование личных встреч команд
    */
   getMatchPersonalMeetings = (data) => {
      let template = ``;

      for (let i = 0; i < data.length; i++) {
         template += templates.getPersonalMeetingItem(data[i]);
      }

      $('#match-personal-meetings').html(template);
   };
   /**
    * Формирование статистики за сезон
    */
   getMatchSeasonFigures = (data) => {
      let template = ``;

      for (let i = 0; i < data.length; i++) {
         template += templates.getMatchStatsTitle(data[i].name, this.loadedData.info, i);
         for (let j = 0; j < data[i].list.length; j++) {
            template += templates.getMatchStats(data[i].list[j]);
         }
      }

      $('#match-season-stats').html(template);
   };

   /**
    * Формирование таба составов
    */
   initLineupsTab = () => {
      let data = this.loadedData['lineups'];

      data.club1 && this.getClubLineups(data.club1);
      data.club2 && this.getClubLineups(data.club2, true);
      data.officials && this.getOfficials(data.officials);
   };
   /**
    * Формирование таба составов
    */
   getClubLineups = (club, isAway) => {
      /* Скрыто до договоренности о полном функционале
      club.main && this.getMainLineups(club.main, club.tactic, isAway);
      */

      club.reserve && this.getMainSquad(club.main, isAway);


      club.reserve && this.getSubstitutes(club.reserve, isAway);
      club.coach && this.getCoaches(club.coach, isAway);
      club.staff && this.getStaff(club.staff, isAway);
   };
   /**
    * Формирование поля
    */
   getMainLineups = (data, tactic, isAway) => {
      let lines = this.getFieldLines(data);

      this.getFieldLinesHTML(lines, isAway);
      this.getFieldTactic(tactic, isAway);
      this.getClubLogo(isAway);
   };
   /**
    * Формирование объекта с линиями
    */
   getFieldLines = (data) => {
      let result = {
         a0: { count: 0, html: '' },
         a1: { count: 0, html: '' },
         a2: { count: 0, html: '' },
         a3: { count: 0, html: '' },
      };

      for (let i = 0; i < data.length; i++) {
         let amplua = getAmpluaId(+data[i].startingPositionId);
         let player = templates.getPlayerMainTemplate(data[i]);

         if (amplua === 0 || amplua === 1 || amplua === 2 || amplua === 3) {
            result['a' + amplua]['count'] += 1;
            result['a' + amplua]['html'] += player;
         }
      }

      return result;
   };
   /**
    * Формирование разметки линий команд
    */
   getFieldLinesHTML = (lines, isAway) => {
      if (isAway) {
         $('#field-away').html(templates.getAwayLines(lines));
      } else {
         $('#field-home').html(templates.getHomeLines(lines));
      }
   };
   /**
    * Добавление тактики на поле
    */
   getFieldTactic = (tactic, isAway) => {
      if (isAway) {
         $('#tactic-away').text(tactic);
      } else {
         $('#tactic-home').text(tactic);
      }
   };
   /**
    * Добавление тактики на поле
    */
   getClubLogo = (isAway) => {
      if (isAway) {
         $('#logo-away').html(`<img src="${this.loadedData.info.logo2}" alt="" />`);
      } else {
         $('#logo-home').html(`<img src="${this.loadedData.info.logo1}" alt="" />`);
      }
   };
   /**
    * Добавление игроков на основного состава
    */
   getMainSquad = (data, isAway) => {
      let template = ``;
      for (let i = 0; i < data.length; i++) {
         template += templates.getSubstitutePlayer(data[i], isAway);
      }

      if (isAway) {
         $('#main-squad-away').html(template);
      } else {
         $('#main-squad-home').html(template);
      }
   };
   /**
    * Добавление игроков на замене
    */
   getSubstitutes = (data, isAway) => {
      let template = ``;
      for (let i = 0; i < data.length; i++) {
         template += templates.getSubstitutePlayer(data[i], isAway);
      }

      if (isAway) {
         $('#sub-away').html(template);
      } else {
         $('#sub-home').html(template);
      }
   };

   /**
    * Добавление тренеров
    */
   getCoaches = (data, isAway) => {
      let template = ``;
      for (let i = 0; i < data.length; i++) {
         template += templates.getStaff(data[i], isAway);
      }

      if (isAway) {
         $('#coaches-away').html(template);
      } else {
         $('#coaches-home').html(template);
      }
   };

   /**
    * Добавление тренеров
    */
   getStaff = (data, isAway) => {
      let template = ``;
      for (let i = 0; i < data.length; i++) {
         template += templates.getStaff(data[i], isAway);
      }

      if (isAway) {
         $('#staff-away').html(template);
      } else {
         $('#staff-home').html(template);
      }
   };

   /**
    * Добавление тренеров
    */
   getOfficials = (data) => {
      let template = ``;
      for (let i = 0; i < data.length; i++) {
         template += templates.getOfficials(data[i]);
      }

      $('#match-officials').html(template);
   };
   /**
    * Инициализация Медиа таба
    */
   initMediaTab = () => {
      let data = this.loadedData.media;

      data.video && this.initVideo(data.video);
      data.photo && this.initPhotos(data.photo);
      data.news && this.initNews(data.news);

      new ModalGallery();
   };
   /**
    * Видео матча
    */
   initVideo = (videos) => {
      let template = ``;

      for (let i = 0; i < videos.length; i++) {
         template += templates.getMediaItem(videos[i], i);
      }

      $('#match-video').html(template);
   };
   /**
    * Фото матча
    */
   initPhotos = (photos) => {
      let template = ``;

      for (let i = 0; i < photos.length; i++) {
         template += templates.getPhotoItem(photos[i], i);
      }

      $('#photos').html(template);
   };
   /**
    * Новости матча
    */
   initNews = (news) => {
      let template = ``;

      for (let i = 0; i < news.length; i++) {
         template += templates.getNewsItem(news[i], i);
      }

      $('#match-news').html(template);
   };
}
