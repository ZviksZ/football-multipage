import * as $ from 'jquery';
import { getData } from '../../api/api.js';
import { templates } from '../../templates/templates.js';

export class MainMatches {
   constructor() {
      this.$matchesSection = $('#main-matches');

      if (this.$matchesSection.length === 0) {
         return false;
      }

      this.$matchesSelect = $('#matches-select');
      this.$matchesContainer = $('#matches-container');

      this.init();
   }

   init = () => {
      this.initialRender();

      this.$matchesSelect.on('change', this.onWeekChange);
   };

   initialRender = async () => {
      let currentWeek = this.$matchesSelect.val();

      this.currentData = await getData({ uri: 'getMatches', body: { week: currentWeek } });

      this.getHtmlFromData();
   };

   onWeekChange = async (e) => {
      let currentWeek = $(e.currentTarget).val();

      this.toggleLoader();

      this.currentData = await getData({ uri: 'getMatches', body: { week: currentWeek } });

      this.getHtmlFromData();
   };

   getHtmlFromData = () => {
      let matches = this.currentData.matches;
      let matchesTemplate = ``;
      let prevDate = ``;

      for (let i = 0; i < matches.length; i++) {
         if (i === 0) {
            matchesTemplate += templates.getMatchesDate(matches[i], prevDate, true);
         } else {
            matchesTemplate += templates.getMatchesDate(matches[i], prevDate, false);
         }

         prevDate = matches[i].date.split(' ')[0];
         matchesTemplate += templates.getMatchTemplate(matches[i]);
      }

      this.$matchesContainer.html(matchesTemplate);
   };

   toggleLoader = () => {
      if (this.$matchesContainer.find('.loader-wrap').length > 0) {
         this.$matchesContainer.find('.loader-wrap').remove();
      } else {
         this.$matchesContainer.html('<div class="loader-wrap"><div class="loader"></div></div>');
      }
   };
}
