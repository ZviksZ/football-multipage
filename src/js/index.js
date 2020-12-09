import * as $                                            from 'jquery';
import { ClubMediaSelect, ClubPageInit }                 from './components/club-page';
import { CustomTabs }                                    from './components/custom-tabs';
import { HeaderMenu }                                    from './components/header-menu';
import { MainMatches, MainTable }                        from './components/main-page';
import { MatchDropdown, MatchEventsTabs, MatchPageInit } from './components/match-page';
import { ModalGallery }                                  from './components/modal-gallery';
import { ModalWindowFullScreen } from './components/modal-window-fullscreen';
import { CustomSelect }          from './components/custom-select';
import { PlayerPageInit }        from './components/player-page';
import { RefereePage }           from './components/referee-page';
import { ScrollLoadSection }     from './components/scroll-load-section';
import { SiteSearch }            from './components/site-search';
import { StatisticsPage }        from './components/statistics-page';
import { MediaVideo }            from './components/video-modal';

window.jQuery = require('jquery');

$(function () {
   // Открытие/закрытие меню
   new HeaderMenu();



   //Инициализация функционала табов
   new CustomTabs();

   //Открытие видео в модалке
   new MediaVideo();

   //Подгрузка матчей и таблиц на главной странице
   new MainMatches();
   new MainTable();

   //Детальная страница матча
   new MatchPageInit();
   new MatchEventsTabs();

   //Детальная страница клуба
   new ClubPageInit();
   new ClubMediaSelect();

   //Детальная страница игрока
   new PlayerPageInit();

   //Детальная страница арбитра
   new RefereePage();

   //Страница статистики
   new StatisticsPage();

   //Общий функционал подгрузки данных при скроле
   new ScrollLoadSection();

   //Фотогалерея в модальном окне
   new ModalGallery();

   // инициализация функционала модальных окон
   let modal = new ModalWindowFullScreen();

   //Функционал поиска по сайту
   new SiteSearch();

   //Инициализация плагина select
   if ($('.custom-select:not(.loaded-select)').length > 0) {
      new CustomSelect();
   }


   //Прячем прелоадер, когда все срипты загрузились
   setTimeout(() => {
      $('.preloader').addClass('preloader-hide');
   }, 200);
});
