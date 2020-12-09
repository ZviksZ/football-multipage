import * as $ from 'jquery';
import { getData } from '../../api/api.js';
import { templates } from '../../templates/templates.js';

export class MainTable {
   constructor() {
      this.$tableSection = $('#tournament-table-section');

      if (this.$tableSection.length === 0) {
         return false;
      }

      this.$tableSelect = this.$tableSection.find('#tournament-table-select');
      this.$tableContainer = this.$tableSection.find('#tournament-table-container');

      this.init();
   }

   init = () => {
      this.initialRender();

      this.$tableSelect.on('change', this.onWeekChange);

      this.$tableContainer.on('click', 'tr', this.onClubPageLocation)
   };

   initialRender = async () => {
      let currentWeek = this.$tableSelect.val();

      this.currentData = await getData({ uri: 'getTable', body: { week: currentWeek } });

      this.getHtmlFromData();
   };

   onWeekChange = async (e) => {
      let currentWeek = $(e.currentTarget).val();

      this.toggleLoader();

      this.currentData = await getData({ uri: 'getTable', body: { week: currentWeek } });

      this.getHtmlFromData();
   };

   getHtmlFromData = () => {
      let teams = this.currentData;
      let matchesTemplate = ``;

      for (let i = 0; i < teams.length; i++) {
         matchesTemplate += templates.getTournamentTableRow(teams[i]);
      }

      this.$tableContainer.find('table tbody').html(matchesTemplate);
      this.$tableContainer.find('table').removeClass('hide');
      this.$tableContainer.find('.loader-wrap').remove();
   };

   toggleLoader = () => {
      if (this.$tableContainer.find('.loader-wrap').length > 0) {
         this.$tableContainer.find('.loader-wrap').remove();
      } else {
         this.$tableContainer.append('<div class="loader-wrap"><div class="loader"></div></div>');
         this.$tableContainer.find('table').addClass('hide');
      }
   };

   onClubPageLocation = (e) => {
      let page = $(e.currentTarget).attr('data-club-link');

      location.href = page;
   };
}
