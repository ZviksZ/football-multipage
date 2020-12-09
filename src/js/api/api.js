import { mockData } from './mockUp.js';

const BASE_URI = `/ajax`;
const AJAX_MODE = 'devMode';

export const getData = async (response) => {
   console.log(response);

   /*if (response.uri == 'news') {
      return await fetchData(response);
   }*/

   if (AJAX_MODE === 'devMode') {
      fetchData(response);

      switch (response.uri) {
         case 'getMatches':
            return mockData[response.uri][response.body.week];
         case 'getTable':
            return mockData[response.uri][response.body.week];
         case 'getSearch':
            return mockData[response.uri];
         /*case 'getMatch':
            return mockData[response.uri][response.body.type];*/
         /*case 'getClub':
            return mockData[response.uri][response.body.type];
         case 'getClubMatches':
            return mockData[response.uri]['tournament' + response.body.tournament]['season' + response.body.season][response.body.page];*/
         /*case 'getPlayer':
            return mockData[response.uri];*/
         /*case 'getNews':
            return mockData[response.uri][response.body.type][response.body.page];*/
         /*case 'getClubs':
            return mockData[response.uri]['season' + response.body.season][response.body.page];*/
         /*case 'getPlayers':
            return mockData[response.uri][response.body.page];*/
         /*case 'getReferees':
            return mockData[response.uri][response.body.page];*/
         case 'getEntries':
            return mockData[response.uri][response.body.page];
         case 'getWithdrawal':
            return mockData[response.uri][response.body.page];
         /*case 'getFixtures':
            return mockData[response.uri][response.body.matchday];
         case 'getYouthFixtures':
            return mockData[response.uri][response.body.matchday];*/
        /* case 'getRefereeMatches':
            return mockData[response.uri][response.body.season];*/
         case 'getStatistics':
            return mockData[response.uri][response.body.type];
         case 'getStatisticsFull':
            return mockData[response.uri][response.body.type][response.body.stat][response.body.page];
         default:
            return await fetchData(response);
      }
   } else if (AJAX_MODE === 'prodMode') {
      return await fetchData(response);
   }
};

const fetchData = async (response) => {
   return await fetch(`${BASE_URI}/${response.uri}`, {
      headers: {
         Accept: 'application/json',
         'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(response.body)
   })
      .then((res) => res.json())
      .catch((err) => this.onError());
};
