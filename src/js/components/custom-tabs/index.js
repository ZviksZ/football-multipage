import * as $ from 'jquery';

export class CustomTabs {
   constructor() {
      this.$container = $('.custom-tabs__container');
      if (this.$container.length === 0) {
         return false;
      }

      this.$tabItems = this.$container.find('.custom-tabs .item');
      this.$tabBlocks = this.$container.find('.custom-tabs__item');


      this.init();
   }
   init = () => {
      this.initActiveTab();

      this.$container.find('.custom-tabs .item').on('click', this.changeTab);
   };

   initActiveTab = () => {
      if (this.$container.find('.custom-tabs .item.active').length > 0) {
         let tab = this.$container.find('.custom-tabs .item.active').attr('data-tab');

         this.$container.find('.custom-tabs__item[data-tab="' + tab + '"]').addClass('active');
      } else {
         let tab = this.$container.find('.custom-tabs .item').first().attr('data-tab');

         this.$container.find('.custom-tabs .item[data-tab="' + tab + '"]').addClass('active');
         this.$container.find('.custom-tabs__item[data-tab="' + tab + '"]').addClass('active');
      }
   };

   changeTab = (e) => {
      e.preventDefault();

      let tab = $(e.currentTarget).attr('data-tab');


      this.$tabItems.removeClass('active');
      this.$tabBlocks.removeClass('active');

      this.$container.find('.custom-tabs .item[data-tab="' + tab + '"]').addClass('active');
      this.$container.find('.custom-tabs__item[data-tab="' + tab + '"]').addClass('active');
   };
}
