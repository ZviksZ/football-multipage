import * as $ from 'jquery';

export class MatchEventsTabs {
   constructor() {
      this.$eventsTabs = $('.match-events-tabs .item');

      if (this.$eventsTabs.length === 0) {
         return false;
      }

      this.init();
   }

   init = () => {
      this.$eventsTabs.on('click', this.changeEventType);
   };

   changeEventType = (e) => {
      let type = $(e.currentTarget).attr('data-protocol');

      this.$eventsTabs.removeClass('active');

      if (type === '1') {
         $('#match-events-list .item:not(.protocol-item)').removeClass('show-event');
      } else {
         $('#match-events-list .item:not(.protocol-item)').addClass('show-event');
      }

      $('.match-events-tabs .item[data-protocol="' + type +'"]').addClass('active');
   };
}
