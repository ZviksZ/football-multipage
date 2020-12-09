import * as $ from 'jquery';

export class HeaderMenu {
   constructor() {
      this.$body = $('body');

      this.$burgerBtn = $('#header .header__burger');
      this.$menuItem = $('.header__menu .item-with-submenu.item-menu');
      this.$menuSubmenu = $('.header__menu .submenu');

      this.init();
   }

   init = () => {
      this.$burgerBtn.on('click', this.toggleMenu);
      this.$menuItem.on('click', this.openSubmenu);
   };

   toggleMenu = (e) => {
      e.preventDefault();

      if (this.$body.hasClass('menu-open')) {
         this.$body.removeClass('menu-open');
      } else {
         this.$body.addClass('menu-open');
      }
   };

   openSubmenu = (e) => {
      e.preventDefault();

      let submenuId = $(e.currentTarget).attr('data-submenu');

      this.$menuItem.removeClass('active');
      this.$menuSubmenu.addClass('hide');

      $('.header__menu .item-with-submenu.item-menu[data-submenu="' + submenuId + '"]').addClass('active');
      $('.header__menu .submenu[data-submenu="' + submenuId + '"]').removeClass('hide');
   };
}
