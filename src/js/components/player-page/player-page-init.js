import * as $ from 'jquery';
import Swiper from 'swiper/js/swiper.min';
import { getData } from '../../api/api.js';
import { templates } from '../../templates/templates.js';
import { ModalGallery } from '../modal-gallery';

const ProgressBar = require('progressbar.js');

export class PlayerPageInit {
   constructor() {
      this.$playerContentBlock = $('#player-content');

      if (this.$playerContentBlock.length === 0) {
         return false;
      }

      this.playerId = this.$playerContentBlock.attr('data-player');

      this.isOverviewLoaded = false;

      this.init();
   }

   init = () => {
      this.getPlayerData();

      /* Скрыто до договоренности о полном функционале
      this.$playerContentBlock.find('[data-tab="overview"]').on('click', this.initOverviewTab);
      */
   };

   addLoader = () => {
      if (this.$playerContentBlock.find('.section-content-wrap .loader-full-page').length === 0) {
         this.$playerContentBlock.find('.section-content-wrap').append(`
              <div class="loader-full-page">
                  <div class="loader-wrap">
                     <div class="loader"></div>
                 </div>
              </div>
            `);
      }
   };
   removeLoader = () => {
      if (this.$playerContentBlock.find('.section-content-wrap .loader-full-page').length > 0) {
         this.$playerContentBlock.find('.section-content-wrap .loader-full-page').remove();
      }
   };

   /**
    * Загружаем стартовые данные об игроке
    */
   getPlayerData = async () => {
      this.addLoader();
      this.loadedData = await getData({ uri: 'players', body: { action: 'getPlayer', id: this.playerId } });

      this.removeLoader();

      this.initOverviewTab();
      /* Скрыто до договоренности о полном функционале
      this.initStatsTab();
      */
   };
   /**
    * Инициализируем таб Overview
    */
   initOverviewTab = () => {
      if (!this.isOverviewLoaded) {

         /*Временное, пока усечен функционал*/
         this.getMainPlayerStats();
         this.initPlayerOverviewAttack();
         this.initPlayerOverviewDiscipline();

         /*END - Временное, пока усечен функционал*/
         this.initPlayerSliderContent();
         this.initPlayerSlider();
         this.initPlayerNews();
         this.initPlayerVideo();
         this.initPlayerPhoto();
         this.initPlayerTransfers();

         new ModalGallery();

         this.isOverviewLoaded = true;
      }
   };

   initPlayerOverviewAttack = () => {
      let data = this.loadedData
      if (data.info.amplua == 0) {
         $('.player-overview-attack').addClass('hide')
      } else {
         let template = ``;
         template += templates.getBasePlayerEventHTML(data.stats['k100103']);
         template += templates.getBasePlayerEventHTML(data.stats['k10025']);
         template += templates.getBasePlayerEventHTML(data.stats['k1006666']);

         $('#player-overview-attack-list').html(template)
      }
   }

   initPlayerOverviewDiscipline = () => {
      let data = this.loadedData

      let template = ``;
      template += templates.getBasePlayerEventHTML(data.stats['k10032']);
      template += templates.getBasePlayerEventHTML(data.stats['k10033']);

      $('#player-overview-discipline-list').html(template)
   }



   /**
    * Инициализируем таб Stats
    */
   initStatsTab = () => {
      this.getExtendedStatisticsPlayerHTML();
      this.getMainPlayerStats();
      this.initCircleItems();
   };
   /**
    * Добавляем html статистики в нужные блоки(плюс их отображение и порядок на странице)
    */
   getExtendedStatisticsPlayerHTML = () => {
      let data = this.loadedData.stats;
      let amplua = this.loadedData.info.ampluaId;

      if (!data) return '';

      // объект с готовыми HTML статистических показателей
      let eventsHTML = this.getExtendedEventsClassificatorHTML(data);

      // группы статистических данных
      let typeEvents = {
         k1: 'Атака',
         k2: 'Защита',
         k3: 'Дисциплина',
         k4: 'Фитнес показатели',
         k5: 'Командная игра',
      };

      // формируем порядок скиллов и статистических данных в зависимости от амплуа
      // events - ID событий из справочника HTML!!!
      let events = {};

      switch (+amplua) {
         // нападающие / полузащитники
         case 3:
         case 2:
            events = [
               {
                  typeEvent: 1,
                  events: [1, 2, 17, 37, 4, 5, 6],
               },
               {
                  typeEvent: 4,
                  events: [7],
               },
               {
                  typeEvent: 5,
                  events: [8, 9],
               },
               {
                  typeEvent: 3,
                  events: [10, 11, 34, 35],
               },
               {
                  typeEvent: 2,
                  events: [12, 13, 14, 44, 25, 26, 27, 28, 29],
               },
            ];
            break;

         // защитники
         case 1:
            events = [
               {
                  typeEvent: 2,
                  events: [30, 31, 12, 13, 14, 44, 25, 26, 27, 28, 29],
               },
               {
                  typeEvent: 4,
                  events: [7],
               },
               {
                  typeEvent: 5,
                  events: [32, 33, 20, 43, 21, 22],
               },
               {
                  typeEvent: 3,
                  events: [10, 11, 34, 35],
               },
               {
                  typeEvent: 1,
                  events: [36, 37, 1, 2, 17],
               },
            ];
            break;

         // вратари
         case 0:
            events = [
               {
                  typeEvent: 2,
                  events: [38, 15, 16, 46, 40, 41, 45, 29, 31, 28],
               },
               {
                  typeEvent: 3,
                  events: [10, 11, 34],
               },
               {
                  typeEvent: 5,
                  events: [36, 9, 8, 43, 21],
               },
            ];
            break;
      }

      $('#player-stats').find('.player-stats-blocks .section-block').addClass('hide-block');
      for (let i = 0; i < events.length; i++) {
         let item = events[i],
            list = item['events'];

         let groupHTML = '';
         for (let j = 0; j < list.length; j++) {
            groupHTML += eventsHTML['k' + list[j]];
         }

         if (groupHTML) {
            let order = i + 1;
            let currentBlock = $('#player-stats').find('.k' + item['typeEvent']);
            currentBlock.removeClass('hide-block').addClass('order-' + order);
            currentBlock.find('.section-content').html(groupHTML);
         }
      }
   };
   /**
    * Получаем html для всех видов событий
    */
   getExtendedEventsClassificatorHTML = () => {
      let data = this.loadedData.stats;
      let result = {};

      // как забивал(тело)
      result['k1'] = this.getHowGoalHTML(data);
      // куда забивал(зоны ворот)
      result['k2'] = this.getZoneGateGoalHTML(data);
      // пенальти
      result['k4'] = templates.getBasePlayerEventHTML(data['k100103']);
      // удары
      result['k5'] = templates.getBasePlayerEventHTML(data['k10061']);
      // круги Забитые пенальти / Удары в створ
      result['k6'] = this.getDoubleRoundGaugeHTML(
         [
            [data['k100103'], data['k100104']],
            [data['k10061'], data['k10049']],
         ],
         true
      );
      // фитнес графики по матчам
      result['k7'] = this.getFitnessHTML(data['k99999']);
      // голевые передачи
      result['k8'] = templates.getBasePlayerEventHTML(data['k10020']);
      // передачи
      result['k9'] = templates.getBasePlayerEventHTML(data['k1003']);
      // блок с ЖК/КК
      result['k10'] = this.getDisciplineCardsHTML(data['k10032'], data['k10033']);
      // фолы
      result['k11'] = templates.getBasePlayerEventHTML(data['k10013']);
      // отборы
      result['k12'] = templates.getBasePlayerEventHTML(data['k100280']);
      // единоборства
      result['k13'] = templates.getBasePlayerEventHTML(data['k100277']);
      // круги Успешные отборы / Выигранные единоборства
      result['k14'] = this.getDoubleRoundGaugeHTML(
         [
            [data['k100280'], data['k100281']],
            [data['k100277'], data['k100278']],
         ],
         true
      );
      // ударов по воротам вратаря
      result['k15'] = templates.getBasePlayerEventHTML(data['k10057']);
      // график % отбитых ударов вратаря
      result['k16'] = this.getDoubleRoundGaugeHTML([data['k10057'], data['k10058']]);
      // карта голов
      result['k17'] = this.getMapGoalsHTML(data['k1003333']);
      // Голы со штрафных
      result['k18'] = templates.getBasePlayerEventHTML(data['k100375']);
      // Упущенные голевые моменты
      result['k19'] = templates.getBasePlayerEventHTML(data['k100438']);
      // Навесы
      result['k20'] = templates.getBasePlayerEventHTML(data['k100357']);
      // Передач в среднем за матч
      result['k21'] = templates.getBasePlayerEventHTML(data['k1005555']);
      // Созданные голевые моменты
      result['k22'] = templates.getBasePlayerEventHTML(data['k100436']);
      // Отборы
      result['k23'] = templates.getBasePlayerEventHTML(data['k100280']);
      // Единоборства
      result['k24'] = templates.getBasePlayerEventHTML(data['k100277']);
      // Выносы мяча
      result['k25'] = templates.getBasePlayerEventHTML(data['k10029']);
      // Блокированные удары
      result['k26'] = templates.getBasePlayerEventHTML(data['k100578']);
      //Верховые единоборства
      result['k27'] = templates.getBasePlayerEventHTML(data['k10036']);
      //Автоголы
      result['k28'] = templates.getBasePlayerEventHTML(data['k100343']);
      //Грубые ошибки
      result['k29'] = templates.getBasePlayerEventHTML(data['k10028']);
      //Сухие матчи
      result['k30'] = templates.getBasePlayerEventHTML(data['k100961']);
      //Пропущенные голы
      result['k31'] = templates.getBasePlayerEventHTML(data['k10059']);
      //Голевые передачи
      result['k32'] = templates.getBasePlayerEventHTML(data['k10020']);
      //Передачи
      result['k33'] = templates.getBasePlayerEventHTML(data['k1003']);
      //Фолы в среднем за матч
      result['k34'] = templates.getBasePlayerEventHTML(data['k1004444']);
      //Офсайды
      result['k35'] = templates.getBasePlayerEventHTML(data['k10051']);
      //Голы
      result['k36'] = templates.getBasePlayerEventHTML(data['k10025']);
      //Голы в среднем за матч
      result['k37'] = templates.getBasePlayerEventHTML(data['k1006666']);
      //Сейвы
      result['k38'] = templates.getBasePlayerEventHTML(data['k10060']);
      //Удары
      result['k39'] = templates.getBasePlayerEventHTML(data['k10061']);
      //Игры на выходе
      result['k40'] = templates.getBasePlayerEventHTML(data['k10054']);
      //Пенальти всего
      result['k41'] = templates.getBasePlayerEventHTML(data['k100382']);
      //Точность передач
      result['k43'] = this.getDoubleRoundGaugeHTML([data['k1003'], data['k1002']]);
      // Перехваты
      result['k44'] = templates.getBasePlayerEventHTML(data['k1298']);
      // Удачная игра на выходе / Отбитые пенальти
      result['k45'] = this.getDoubleRoundGaugeHTML([
         [data['k1054'], data['k1055']],
         [data['k1382'], data['k1355']],
      ]);
      //Карта ударов вратаря
      //На вход 2 массива с отбитыми ударами и пропущенными
      result['k46'] = this.getMapGoalGoalkeeperHTML([data['k1003333'], data['k1008888']]);

      return result;
   };
   /**
    * Главная статистика игрока
    */
   getMainPlayerStats = () => {
      let data = this.loadedData;
      let template = ``;

      if (data.info.amplua === undefined) return '';

      //кол-во матчей
      let matches = data.stats['k1009997'],
         matchesLabel = ['Match', 'Matches', 'Matches'];

      if (!matches) return '';

      template += templates.getMainPlayerStatsItem(matches, matchesLabel);

      //кол-во минут
      let minutes = data.stats['k1007777'],
         minutesLabel = ['Minute', 'Minutes', 'Minutes'];

      if (!minutes) minutes = { value: 0 };

      template += templates.getMainPlayerStatsItem(minutes, minutesLabel);

      // для вратарей вместо голов выводим сухие матчи! - временно скрыто
      if (data.info.amplua == 0) {
         // кол-во сухих матчей
         /*let clearMatches = data.stats['k100961'],
            clearMatchesLabel = ['Dry match', 'Dry matches', 'Dry matches'];

         if (!clearMatches) clearMatches = { value: 0 };

         template += templates.getMainPlayerStatsItem(clearMatches, clearMatchesLabel);*/
         $('#player-games-info').addClass('double-items')
      } else {
         // кол-во голов
         let goals = data.stats['k10025'],
            goalsLabel = ['Goal', 'Goals', 'Goals'];

         if (!goals) goals = { value: 0 };

         template += templates.getMainPlayerStatsItem(goals, goalsLabel);
      }

      $('#player-games-info').html(template);
   };

   /**
    * Формирование блока Как забивал(тело)
    */
   getHowGoalHTML = (data) => {
      if (!data) return '';

      // если голов нет - не формируем тело
      let goals = data['k10025'];

      if (!goals) return '';
      if (!goals.value) return '';

      let goalData = {
         head: 0,
         body: 0,
         footRight: 0,
         footLeft: 0,
      };
      // голы головой
      if (data['k100948']) goalData.head = data['k100948']['value'] || 0;
      // голы телом
      if (data['k100951']) goalData.body = data['k100951']['value'] || 0;
      // голы правой ногой
      if (data['k100949']) goalData.footRight = data['k100949']['value'] || 0;
      // голы левой ногой
      if (data['k100950']) goalData.footLeft = data['k100950']['value'] || 0;

      return templates.getPlayerHowGoal(goalData);
   };

   /**
    * Формирование блока Куда забивал с воротами
    */
   getZoneGateGoalHTML = (data) => {
      if (!data) return '';

      // если голов нет - не формируем ворота
      let goals = data['k10025'];
      if (!goals) return '';
      if (!goals.value) return '';

      let countGoals = +goals['value'];

      let goalsData = {
         zlt: 0,
         zlb: 0,
         zct: 0,
         zcb: 0,
         zrt: 0,
         zrb: 0,
      };

      // голы забитые в левый верхний угол
      if (data['k100654']) goalsData.zlt = +data['k100654']['value'] || 0;
      // голы забитые в левый нижний угол
      if (data['k100655']) goalsData.zlb = +data['k100655']['value'] || 0;
      // голы забитые  по центру верхом
      if (data['k100656']) goalsData.zct = +data['k100656']['value'] || 0;
      // голы забитые по центру низом
      if (data['k100657']) goalsData.zcb = +data['k100657']['value'] || 0;
      // голы забитые в правый верхний угол
      if (data['k100658']) goalsData.zrt = +data['k100658']['value'] || 0;
      // голы забитые в правый нижний угол
      if (data['k100659']) goalsData.zrb = +data['k100659']['value'] || 0;
      // формируем HTML круга по зонам
      let itemsTemplates = {
         zltHTML: templates.getRoundForZoneGateHTML(countGoals, goalsData.zlt),
         zlbHTML: templates.getRoundForZoneGateHTML(countGoals, goalsData.zlb),
         zctHTML: templates.getRoundForZoneGateHTML(countGoals, goalsData.zct),
         zcbHTML: templates.getRoundForZoneGateHTML(countGoals, goalsData.zcb),
         zrtHTML: templates.getRoundForZoneGateHTML(countGoals, goalsData.zrt),
         zrbHTML: templates.getRoundForZoneGateHTML(countGoals, goalsData.zrb),
      };

      return templates.getZoneGateGoal(itemsTemplates);
   };

   /**
    * Формирование блока Откуда забивал(поле)
    * @param {Object} data - массив с координатами голов
    */
   getMapGoalsHTML = (data) => {
      if (!data) return '';
      if (!data.value) return '';

      let items = data.value,
         itemsCount = items.length;

      let resultHTML = '';

      if (itemsCount) {
         for (let i = 0; i < itemsCount; i++) {
            let item = items[i];
            resultHTML += templates.getPointFieldHTML(item, '');
         }
      }

      if (resultHTML) {
         return templates.getPlayerScoredField(resultHTML);
      } else {
         return ``;
      }
   };

   /**
    * Формирование фитнес показателей
    */
   getFitnessHTML = (data) => {
      if (!data) return '';
      let matches = data.value;

      if (!matches) return '';

      // формируем HTML для 2х блоков фитнес статистики
      let speedHTML = '',
         distanceHTML = '';

      for (let i = 0; i < matches.length; i++) {
         speedHTML += templates.getFitnessSpeedColumn(matches[i]);
         distanceHTML += templates.getFitnessDistanceColumn(matches[i]);
      }

      return templates.getFitnessFullTemplate(speedHTML) + templates.getFitnessFullTemplate(distanceHTML, true);
   };
   /**
    * Формирование желтой и красной карточки
    */
   getDisciplineCardsHTML = (yellowCard, redCard) => {
      if (!yellowCard || !redCard) return '';

      let yellowCardValue = yellowCard.value,
         redCardValue = redCard.value;

      if (!yellowCardValue) yellowCardValue = 0;
      if (!redCardValue) redCardValue = 0;

      return templates.getDisciplineCards(yellowCardValue, redCardValue);
   };
   /**
    * Формирование чартов(по 2)
    */
   getDoubleRoundGaugeHTML = (data, withPercent) => {
      if (!data) return '';
      if (!data.length) return '';

      let param1 = data[0],
         param2 = data[1];

      // формируем HTML кругов для 2х параметров
      let round1HTML = '';

      if (param1.length === 2) {
         round1HTML += templates.getChartHtml(param1, withPercent);
      }

      let round2HTML = '';
      if (param2.length === 2) {
         round2HTML += templates.getChartHtml(param2, withPercent);
      }

      let resultHTML = round1HTML + round2HTML;

      if (!resultHTML) return '';

      return `<div class="player-stats-charts">${resultHTML}</div>`;
   };
   /**
    * Формирование карты отбитых ударов и пропущенных голов вратаря
    */
   getMapGoalGoalkeeperHTML = (data) => {
      if (!data) return '';
      if (!data.length) return '';

      let shots = data[1],
         goals = data[0];

      //Формируем html успешных и неуспешных отражения ударов
      let shotsHTML = '',
         goalsHTML = '';

      if (shots) {
         let shotsValue = shots.value;
         if (shotsValue) {
            for (let i = 0; i < shotsValue.length; i++) {
               shotsHTML += templates.getPointFieldHTML(shotsValue[i], '');
            }
         }
      }

      if (goals) {
         let goalsValue = goals.value;
         if (goalsValue) {
            for (let g = 0; g < goalsValue.length; g++) {
               goalsHTML += templates.getPointFieldHTML(goalsValue[g], 'red');
            }
         }
      }

      //Формируем легенду по ударам
      let legendInfoHTML = '';
      if (shotsHTML) legendInfoHTML += '<div class="item green">Saved</div>';
      if (goalsHTML) legendInfoHTML += '<div class="item red">Missed</div>';

      let resultHTML = shotsHTML + goalsHTML;

      if (resultHTML) {
         return templates.getPlayerScoredField(resultHTML, true, legendInfoHTML);
      } else {
         return ``;
      }
   };
   /**
    * Инициализируем чарты
    */
   initCircleItems = () => {
      this.$playerContentBlock.find('.circle-item').each((_, item) => {
         let percent = +$(item).attr('data-percent');
         let color = this.getChartColor(percent);

         let bar = new ProgressBar.Circle(item, {
            strokeWidth: 8,
            easing: 'easeInOut',
            duration: 1400,
            color: color,
            trailColor: '#ebebeb',
            trailWidth: 8,
            svgStyle: null,
         });

         bar.animate(percent / 100);
      });
   };
   /**
    * Выбор цвета для чарта
    */
   getChartColor = (percent) => {
      if (percent === 0) return '#E73338';
      if (percent >= 1 && percent <= 7) return '#EA4F2E';
      if (percent >= 8 && percent <= 17) return '#ED6B23';
      if (percent >= 18 && percent <= 21) return '#F08917';
      if (percent >= 22 && percent <= 29) return '#F2A40D';
      if (percent >= 30 && percent <= 36) return '#F5C201';
      if (percent >= 37 && percent <= 44) return '#CBC411';
      if (percent >= 45 && percent <= 50) return '#9EC322';
      if (percent >= 51 && percent <= 58) return '#70C234';
      if (percent >= 59 && percent <= 65) return '#41C246';
      if (percent >= 66 && percent <= 100) return '#13C158';

      return '#ebebeb';
   };
   /**
    * Инициализируем слайдер с игроком матча
    */
   initPlayerSlider = () => {
      this.slider = new Swiper($('#player-of-match__slider'), {
         effect: 'slide',
         loop: false,
         preloadImages: false,
         lazy: true,
         resistance: false,
         slidesPerView: 1,
         spaceBetween: 34,
         pagination: {
            el: '.swiper-pagination',
         },
      });
   };
   /**
    * Инициализируем данные в слайдер с игроком матча
    */
   initPlayerSliderContent = () => {
      let data = this.loadedData.overview.playerMatch;
      let template = ``;

      for (let i = 0; i < data.length; i++) {
         template += templates.getPlayerOfMatchSlide(data[i], this.loadedData.info.photo);
      }

      $('#player-of-match__slider .swiper-wrapper').html(template);
   };

   /**
    * Новости команды
    */
   initPlayerNews = () => {
      let data = this.loadedData.overview.news;
      let template = ``;

      for (let i = 0; i < data.length; i++) {
         let index = i + 1;
         template += templates.getNewsItem(data[i], index);
      }

      $('#player-news-list').html(template);
   };
   /**
    * Видео игрока
    */
   initPlayerVideo = () => {
      let data = this.loadedData.overview.video;
      let template = ``;

      for (let i = 0; i < data.length; i++) {
         let index = i + 1;
         template += templates.getMediaItem(data[i], index);
      }

      $('#player-video-list').html(template);
   };
   /**
    * Фото игрока
    */
   initPlayerPhoto = () => {
      let photos = this.loadedData.overview.photo;
      let template = ``;

      for (let i = 0; i < photos.length; i++) {
         template += templates.getPhotoItem(photos[i], i);
      }

      $('#photos').html(template);
   };
   /**
    * Трансферы игрока
    */
   initPlayerTransfers = () => {
      let data = this.loadedData.overview.transfer;
      let template = ``;

      for (let i = 0; i < data.length; i++) {
         template += templates.getPlayerTransferItem(data[i]);
      }

      $('#player-transfer-list').html(template);
   };
}
