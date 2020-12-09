import * as $ from 'jquery';

export class ClubMediaSelect {
   constructor() {
      this.$matchesSelect = $('#club-media-select');

      if (this.$matchesSelect.length === 0) {
         return false;
      }

      this.init();
   }

   init = () => {
      this.initStartTab();
      this.$matchesSelect.on('change', this.onTypeChange);
   };

   initStartTab = () => {
      let currentType = this.$matchesSelect.val();

      this.setActiveTab(currentType);
   };

   onTypeChange = async (e) => {
      let currentType = $(e.currentTarget).val();

      this.setActiveTab(currentType);
   };

   setActiveTab = (tab) => {
      $('.club-media [data-type]').removeClass('active');
      $('.club-media [data-type="' + tab + '"]').addClass('active');
   };
}
