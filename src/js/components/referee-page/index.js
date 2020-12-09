import * as $           from 'jquery';
import { getData }      from '../../api/api.js';
import { templates }    from '../../templates/templates.js';
import { CustomSelect } from '../custom-select';

export class RefereePage {
   constructor() {
      this.$matchBlock = $('#referee-matches');
      if (this.$matchBlock.length === 0) return false;

      this.$matchSelect = $('#referee-matches-season');
      this.refereeId = this.$matchBlock.attr('data-referee');
      this.isFirstRender = true;

      this.init();
   }
   init = () => {
      this.initStartMatches();

      this.$matchSelect.on('change', this.changeRefereeMatches);
   };

   initStartMatches = () => {
      //let seasonId = this.$matchSelect.val();
      this.getRefereeMatches('');
   };

   changeRefereeMatches = (e) => {
      let seasonId = $(e.currentTarget).val();
      this.getRefereeMatches(seasonId);
   };

   getRefereeMatches = async (season) => {
      let data = await getData({ uri: 'referees', body: { action: 'getRefereeMatches', id: this.refereeId, season: season } });

      this.getRefereeMatchesTemplate(data.matches);
      if (this.isFirstRender) {
         this.initRefereeSelect(data.seasons);
         new CustomSelect();
         this.isFirstRender = false;
      }
   };

   getRefereeMatchesTemplate = (data) => {
      let template = ``;

      for (let i = 0; i < data.length; i++) {
         template += templates.getRefereesMatchItem(data[i]);
      }

      this.$matchBlock.html(template);
   };

   initRefereeSelect = (data) => {
      let template = ``;

      for (let i = 0; i < data.length; i++) {
         template += `<option value="${data[i].id}">Season ${data[i].name}</option>`;
      }

      this.$matchSelect.html(template);
   };
}
