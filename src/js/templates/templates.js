import moment from 'moment';
import { declOfNum, kFormatter } from '../components/helpers';
import { getEventItemIcon, getMatchResultIcon, getMatchStatClass } from '../components/match-page/match-helpers.js';

export const templates = {
   /**
    * Шаблон матча
    * @param {String} match - отдельный матч
    */
   getMatchTemplate(match) {
      let liveIcon = ``;
      let groupIcon = ``;
      let timeString = match.date.split(' ')[1];
      let time = timeString.substring(0, timeString.length - 3);
      let isTime = false;
      let result = ``;
      let coef = ``;
      let isCoef = ``;

      if (match.status === 3) {
         result = `${match.goal1}:${match.goal2}`;
      } else if (match.status === 1) {
         result = `${time}`;
         isTime = true;

         isCoef = `match-with-coef`;

         coef = `
            <div class="divider"></div>
              <div class="coef">
                  <div class="item">
                      <span class="team">1</span>
                      <span class="num">${match.coefficients.outcome_1}</span>
                  </div>
                  <div class="item">
                      <span class="team">X</span>
                      <span class="num">${match.coefficients.outcome_2}</span>
                  </div>
                  <div class="item">
                      <span class="team">2</span>
                      <span class="num">${match.coefficients.outcome_3}</span>
                  </div>
              </div>
         `;
      } else if (match.status === 2) {
         liveIcon = `<span class="live-icon"></span>`;
         result = `${match.goal1}:${match.goal2}`;
      }

      if (match.group) {
         groupIcon = `<span class="group-icon ${match.group === 'A' ? 'icon-red' : 'icon-blue'}">${match.group}</span>`
      }

      return `
         <a href="/matches/match_${match.id}.html" class="match-item ${isCoef}">
            ${liveIcon}
            ${groupIcon}
            <div class="club home">
                <span class="club__name">${match.club1}</span>
                <img class="club__logo" src="${match.club1_logo}" alt="${match.club1}">
            </div>
            <div class="result ${isTime && 'time'}"><span>${result}</span></div>
            <div class="club away">
                <img class="club__logo" src="${match.club2_logo}" alt="${match.club2}">
                <span class="club__name">${match.club2}</span>
            </div>
            ${coef}            
            <i class="icon-right-arrow match-arrow"></i>
        </a>
      `;
   },
   /**
    * Шаблон матча - вывод даты и лиги
    * @param {Object} match - объект матча
    * @param {String} prevDate - дата предыдущего матча этого тура
    * @param {Boolean} matchLeague - выводить ли лигу
    */
   getMatchesDate(match, prevDate, matchLeague) {
      if (match.date && match.date.split(' ')[0] !== prevDate) {
         let parseDate = match.date.split(' ')[0];
         let dateString = moment(parseDate).format('dddd D MMMM YYYY');
         let league = ``;
         if (matchLeague) {
            league += `<span class="league-name"><img src="${match.leagueImg}" alt=""><span>${match.league}</span></span>`;
         }
         return `
            <div class="match-caption">
               <span>${dateString}</span>
               ${league}
            </div>
         `;
      } else {
         return '';
      }
   },
   /**
    * Шаблон строки турнирной таблицы
    * @param {String} team - объект команды
    */
   getTournamentTableRow(team) {
      let progressClass = team.placeChange === 1 ? 'up' : team.placeChange === -1 ? 'down' : 'stay';

      return `
         <tr data-club-link="/clubs/club_${team.club}.html">
                <td class="place">
                    <div class="border"></div>
                    <span>${team.place}</span>
                </td>
                <td class="progress">
                    <i class="${progressClass}"></i>
                </td>
                <td class="club">
                    <div class="wrap">
                        <img src="${team.clubLogo}" alt="" class="logo">
                        <span>${team.clubName}</span>
                    </div>
                </td>
                <td class="games">
                    <span>${team.games}</span>
                </td>
                <td class="goals">
                    <span>${team.goals}-${team.goalsOut}</span>
                </td>
                <td class="points">
                    <span>${team.points}</span>
                </td>
            </tr>
      
      `;
   },
   /**
    * Шаблон заголовка в результатах поиска
    * @param {String} title - текст заголовка
    */
   getSectionTitle(title) {
      return `
         <div class="section-title">
              <span>${title}</span>
          </div>
      `;
   },
   /**
    * Шаблон игрока в результатах поиска
    * @param {String} player - объект игрока
    * @param {Boolean} isStaff - персонал или игрок
    */
   getPlayerItem(player, isStaff = false) {
      if (isStaff) {
         return `
             <a href="/staff/staff_${player.id}.html" class="player-list-item">
                     <div class="photo" style="background-image: url(${player.img})"></div>
                     <div class="player-info">
                         <div class="name">${player.name}</div>
                         <div class="country">
                             ${player.position ? `<span>${player.position}</span>` : ''}
                         </div>
                     </div>
                     <i class="icon-right-arrow"></i>
                 </a>      
            `;
      }

      return `
       <a href="/players/player_${player.id}.html" class="player-list-item">
               <div class="photo" style="background-image: url(${player.img})"></div>
               <span class="number">${player.number}</span>

               <div class="player-info">
                   <div class="name">${player.name}</div>
                   <div class="country">
                     ${player.countryFlag ? `<img src="${player.countryFlag}" alt="" class="country-flag">` : ''}
                     ${player.country ? `<span>${player.country}</span>` : ''}                      
                       
                   </div>
               </div>
               <i class="icon-right-arrow"></i>
           </a>      
      `;
   },
   /**
    * Шаблон клуба в результатах поиска
    * @param {String} club - объект клуба
    */
   getClubItem(club) {
      return `
         <a href="/clubs/club_${club.id}.html" class="club-list-item">
                  <img src="${club.logo}" alt="" class="logo">
                  <div class="club-info">
                      <div class="name">${club.name}</div>
                      <div class="city">${club.city}</div>
                  </div>
                  <i class="icon-right-arrow"></i>
              </a>
      `;
   },
   /**
    * Шаблон арбитра в списке
    * @param {String} referee - объект арбитра
    */
   getRefereesItem(referee) {
      return `
         <a href="/referees/referee_${referee.id}.html" class="referee-list-item">
                  <span>${referee.name}</span>
                  <i class="icon-right-arrow"></i>
         </a>
      `;
   },
   /**
    * Шаблон матча арбитра
    * @param {String} match - объект матча
    */
   getRefereesMatchItem(match) {
      let parseDate = match.date.split(' ')[0];
      let dateString = moment(parseDate).format('D MMMM YYYY');

      return `
          <a href="/matches/match_${match.id}" class="referee-match-item">
            <div class="info">
                <div class="status">${match.status}</div>
                <div class="match">
                    <span class="score">${match.goal1}:${match.goal2}</span>${match.club1} - ${match.club2}
                </div>
                <span class="date">${dateString} — ${match.stage}</span>
            </div>
            <i class="icon-right-arrow"></i>
        </a>
      `;
   },
   /**
    * Шаблон новости в результатах поиска
    * @param {String} news - объект новости
    */
   getNews(news) {
      return `
         <div class="news-item">
            <div class="img" style="background-image: url(${news.photo})"></div>
            <p>${news.text}</p>
        </div>
      `;
   },
   /**
    * Шаблон события матча
    * @param {String} event - объект события матча
    * @param {String} index - индекс матча по счету
    * @param {Boolean} isAway - выездная команда или нет
    */
   getMatchEvent(event, index, isAway) {
      let additionalClass = isAway || +event.type == 11 ? 'item-right ' : '';
      let isOdd = +index % 2 === 0 ? 'odd ' : '';
      let isProtocol = event.protocol == 1 ? 'protocol-item' : '';
      let eventIcon = getEventItemIcon(event);

      if ([84].indexOf(+event.type) >= 0) {
         return ``;
      } else if ([6, 7, 71, 72, 73, 83].indexOf(+event.type) >= 0) {
         return `<div class="stage">${event.info}</div>`;
      }

      return `
         <div class="item ${additionalClass}${isOdd}${isProtocol}">
            <div class="part">                
               <div class="player">
                  <span>${event.title}</span>
                  <span class="color-gray">${event.info}</span>
               </div>
               ${eventIcon}
            </div>
            <div class="score score-icon">
               <span>${event.time}'</span>
            </div>
         </div>
      `;
   },
   /**
    * Игрок матча
    * @param {String} player - объект игрока матча
    */
   getPlayerOfMatch(player) {
      const { img, team, name } = player;
      return `
         <div class="item">
            <div class="img" style="background-image: url(${img})"></div>
            <div class="text">
               <div class="title">Player of the match</div>
               <div class="name">
                  <img src="${team}" alt="" class="logo" />
                  <span class="color-gray">${name}</span>
               </div>
            </div>
         </div>
      `;
   },
   /**
    * Статистика матча
    * @param {String} title - заголовок вида статистики
    * @param {String} matchInfo - объект общей информации матча
    * @param {Number} index - порядковый номер
    */
   getMatchStatsTitle(title, matchInfo, index) {
      let logos = ``;
      if (index === 0) {
         logos = `
                 <img src="${matchInfo.logo1}" alt="" class="club" />
               <img src="${matchInfo.logo2}" alt="" class="club club-second" />
            `;
      }
      return `
         <div class="match-stats-title">
               ${logos}
               <span class="text">${title}</span>
        </div>
      `;
   },
   /**
    * Статистика матча
    * @param {String} stat - объект статистики матча
    */
   getMatchStats(stat) {
      const { class1, class2 } = getMatchStatClass(stat);

      return `
         <div class="item">
            <div class="stat ${class1}">
               <span>${+stat.club1}</span>
            </div>
            <span class="stat-name">${stat.name}</span>
            <div class="stat stat-right ${class2}">
               <span>${+stat.club2}</span>
            </div>
         </div>
      `;
   },
   /**
    * Последние матчи команд
    * @param {String} data - объект данных о последних матчах
    */
   getH2hDropDown(data) {
      let stateItems = ``;
      let matchItems = ``;

      for (let i = 0; i < data.matches.length; i++) {
         let icon = getMatchResultIcon(data.matches[i].result);
         stateItems += icon;
         matchItems += this.getH2hDropDownItem(data.matches[i], icon);
      }

      return `
        <div class="match-h2h__dropdown">
               <div class="head">
                  <div class="team">
                     <img src="${data.logo}" alt="" class="logo" />
                     <span>${data.club}</span>
                  </div>

                  <div class="state">
                     ${stateItems}
                  </div>

                  <i class="icon-dropdown"></i>
               </div>      
               ${matchItems}
            </div>
      `;
   },
   /**
    * Последние матчи команд
    * @param {String} match - отдельный матч
    * @param {String} icon - иконка результата матча
    */
   getH2hDropDownItem(match, icon) {
      let parseDate = match.date.split(' ')[0];
      let dateString = moment(parseDate).format('D MMMM YYYY');

      return `
          <a href="/match_${match.id}.html" class="item">
            ${icon}
            <div class="text">
               <div class="date">${dateString}</div>
               <div class="score"><span class="bold-text">${match.goal1}:${match.goal2}</span>${match.club1}-${match.club2}</div>
               <div class="league">${match.league}</div>
            </div>
            <i class="icon-right-arrow"></i>
         </a>
      `;
   },
   /**
    * Личная встреча команд
    * @param {String} match - матч
    */
   getPersonalMeetingItem(match) {
      let parseDate = match.date.split(' ')[0];
      let dateString = moment(parseDate).format('D MMMM YYYY');

      return `
          <a href="/matches/match_${match.id}.html" class="item">
               <div class="date">${dateString}</div>
               <div class="info">
                  <div class="club">
                     <span>${match.club1}</span>
                     <img src="${match.logo1}" alt="" class="logo" />
                  </div>
                  <div class="score">${match.goal1}:${match.goal2}</div>
                  <div class="club club-second">
                     <img src="${match.logo2}" alt="" class="logo" />
                     <span>${match.club2}</span>
                  </div>
               </div>
               <i class="icon-right-arrow"></i>
            </a>
      `;
   },
   /**
    * Изображение игрока с карточками и голами
    * @param {Object} player - игрок
    * @param {Boolean} isSub - на замене или нет
    */
   getPlayerPhotoBlock(player, isSub) {
      let change = ``,
         yellow = ``,
         red = ``,
         goal = ``;

      let photo = player.img ? player.img : './img/players/default-photo.svg';

      if (player.change !== 0) change = `<div class="sub icon"></div>`;
      if (+player.yellow) yellow = `<div class="card yellow icon"></div>`;
      if (+player.red) red = `<div class="card red icon"></div>`;
      if (+player.goal)
         goal = `<div class="goal">
                  <span class="text ${isSub ? 'color-text' : ''}">${player.goal > 1 ? player.goal : ''}</span>
                  <div class="goal-img icon"></div>
               </div>`;

      return `
          <div class="match-info-photo" style="background-image: url('${photo}')">
               ${red}
               ${yellow}
               ${goal}
               ${change}
            </div>
      `;
   },
   /**
    * Изображение игрока с карточками и голами
    * @param {String} player - игрок
    */
   getPlayerMainTemplate(player) {
      let photo = this.getPlayerPhotoBlock(player, false);
      let captain = !!+player.captain ? '<span class="captain">K</span>' : '';

      return `  
         <a href="/players/player_${player.id}.html" class="player a${+player.startingPositionId}">
           ${photo}
            <div class="surname">${player.shortname}</div>
            <div class="number">
               ${captain}
               <span>${player.number}</span>
            </div>
         </a>            
      `;
   },
   /**
    * Формирование линий на выезде
    * @param {Object} lines - объект с линиями
    */
   getAwayLines(lines) {
      return `  
           <div class="line-item a3 c${lines.a3.count}">
               ${lines.a3.html}
           </div>
           <div class="line-item a2 c${lines.a2.count}">
              ${lines.a2.html}
           </div>
           <div class="line-item a1 c${lines.a1.count}">
               ${lines.a1.html}
           </div>
           <div class="line-item a0">
               ${lines.a0.html}
           </div>      
      `;
   },
   /**
    * Формирование линий дома
    * @param {String} lines - игрок
    */
   getHomeLines(lines) {
      return `  
          <div class="line-item a0">
               ${lines.a0.html}  
           </div>
           <div class="line-item a1 c${lines.a1.count}">
              ${lines.a1.html}
           </div>
           <div class="line-item a2 c${lines.a2.count}">
               ${lines.a2.html}
           </div>
           <div class="line-item a3 c${lines.a3.count}">
              ${lines.a3.html}
           </div>      
      `;
   },
   /**
    * Формирование замен
    * @param {Object} player - игрок
    * @param {Boolean} isAway - на выезде или нет
    */
   getSubstitutePlayer(player, isAway) {
      let photo = this.getPlayerPhotoBlock(player, true);
      let isSecond = isAway ? 'player-second' : '';
      return `  
         <div class="item">
               <div class="player ${isSecond}">
                  <a href="/players/player_${player.id}.html" class="top">
                     <div class="pos">
                        <span>${player.number}</span>
                        <span class="color-gray">${player.amplua}</span>
                     </div>
                    ${photo}
                     <div class="name">${player.name}</div>
                  </a>
                  <div class="bottom">                     
                     ${player.change !== 0 ? `<div class="arrow"></div><span>${player.change}</span>` : ``}
                  </div>
               </div>
            </div>
      `;
   },
   /**
    * Формирование тренеров
    * @param {Object} staff - работник клуба
    * @param {Boolean} isAway - на выезде или нет
    */
   getStaff(staff, isAway) {
      let isSecond = isAway ? 'player-second' : '';
      let position = staff.position ? `<span class="color-gray position">${staff.position}</span>` : ``;
      let photo = staff.img ? staff.img : './img/players/default-photo.svg';

      return `  
         <div class="item">
               <div class="player ${isSecond}">
                  <a href="/coaches/coach_${staff.id}.html" class="top">
                     <div class="match-info-photo" style="background-image: url(${photo})"></div>
                     <div class="name">
                        <span>${staff.name}</span>
                        ${position}
                     </div>
                  </a>
               </div>
            </div>
      `;
   },
   /**
    * Формирование официальных лиц матча
    * @param {Object} staff - официальное лицо
    */
   getOfficials(staff) {
      let position = staff.title ? `<span class="color-gray position">${staff.title}</span>` : ``;
      let photo = staff.img ? staff.img : './img/players/default-photo.svg';

      return `  
         <a href="#" class="item">
               <div class="match-info-photo photo" style="background-image: url(${photo})"></div>
               <div class="info">
                  <span>${staff.name}</span>
                  ${position}
               </div>
            </a>
      `;
   },
   /**
    * Видео матча
    * @param {Object} video - объект видео
    * @param {Boolean} isFirst - для первого видео
    */
   getVideoBigItem(video, isFirst) {
      let className = isFirst ? 'item-first' : '';
      let parseDate = video.date.split(' ')[0];
      let dateString = moment(parseDate).format('D MMMM YYYY');

      return `      
         <a href="#" class="item ${className}" data-effect-type="open-modal-fade-effect" data-open-modal-button="media-video-modal" data-video=${video.code}>
            <div class="img" style="background-image: url(${video.img})">
               <div class="img-info">
                  <div class="numbers">${video.timecode}</div>
                  <div class="icon video">
                     <i class="icon-dropdown"></i>
                  </div>
               </div>
            </div>
            <div class="info">
               <div class="title">${video.name}</div>
               <div class="text">${dateString}</div>
               <div class="text">${video.views}</div>
            </div>
         </a>
      `;
   },
   /**
    * Фото матча
    * @param {Object} photo - объект видео
    * @param {Number} index - номер слайда для галереи
    */
   getPhotoItem(photo, index) {
      let imgBig = photo.imgBig ? photo.imgBig : photo.img;
      return `      
         <div
               class="photo"
               data-open-modal-button="gallery-modal"
               data-effect-type="open-modal-fade-effect"
               data-slide="${index}"
               data-caption="${photo.name}"
               data-photo="${imgBig}"
               style="background-image: url(${photo.img})"
            ></div>
      `;
   },
   /**
    * Новость матча
    * @param {Object} news - объект новости
    * @param {Number} index - номер по счету новости
    */
   getNewsItem(news, index) {
      let isFirst = index === 0 ? 'news-item-first' : '';
      let parseDate = news.date.split(' ')[0];
      let dateString = moment(parseDate).format('D MMMM YYYY');
      let isDate = index === 0 ? `<div class="date section-text">${dateString}</div>` : '';

      let newsParagraphs = ``;
      if (news.detail) {
         newsParagraphs = this.getNewsParagraphs(news.detail);
      }

      return `      
        <a href="/news/news_${news.id}.html" class="news-item ${isFirst}">
               <div class="img" style="background-image: url(${news.img})"></div>
               ${isDate}
               ${index === 0 ? `<div class="section-subtitle">${news.name}</div>` : `<p>${news.name}</p>`}
               ${newsParagraphs}               
            </a>
      `;
   },
   /**
    * Новость матча(параграфы)
    * @param {Object} details - объект с параграфами
    */
   getNewsParagraphs(details) {
      let template = ``;

      for (let i = 0; i < details.length; i++) {
         template += `<p>${details[i].text}</p>`;
      }
      return template;
   },
   /**
    * Бомбардиры
    * @param {Object} player - объект с данными игрока
    * @param {String} teamLogo - логотип клуба
    */
   getScorersItem(player, teamLogo) {
      return `
         <tr data-player-link="players/player_${player.id}.html">
                <td class="photo">
                    <div class="img" style="background-image: url(${player.img})"></div>
                </td>
                <td class="name">
                    <a href="#" class="wrap">
                        <img src="${teamLogo}" alt="" class="logo">
                        <span>${player.name}</span>
                    </a>
                </td>
                <td class="goals-type"><span>${player.game_penalty}</span></td>
                <td class="goals"><span>${player.goals}</span></td>
            </tr>
      
      `;
   },
   /**
    * Медиа
    * @param {Object} media - объект с медиа
    * @param {Number} index - номер по счету медиа
    */
   getMediaItem(media, index) {
      let isFirst = index === 0 ? 'item-first' : '';
      let type = media.type === 'youtube' ? `data-effect-type="open-modal-fade-effect" data-open-modal-button="media-video-modal" data-video="${media.code}"` : '';
      let icon = media.type === 'youtube' ? '<div class="icon video"><i class="icon-dropdown"></i></div>' : '<div class="icon photo"><i class="icon-photo"></i></div>';
      let numbers = media.type === 'youtube' ? media.timecode : media.count;
      let parseDate = media.date.split(' ')[0];
      let dateString = moment(parseDate).format('D MMMM YYYY');
      let views = kFormatter(media.views);

      return `
        <a href="/media/media_${media.id}.html" class="item ${isFirst}" ${type}>
                        <div class="img" style="background-image: url(${media.img})">
                            <div class="img-info">
                                <div class="numbers">${numbers}</div>
                                ${icon}
                            </div>
                        </div>
                        <div class="info">
                            <div class="title">${media.name}</div>
                            <div class="text">${dateString}</div>
                            <div class="text">${views} views</div>
                        </div>
                    </a>
      
      `;
   },
   /**
    * Информация клуба
    * @param {Object} info - объект с информацией о клубе
    */
   getClubInfo(info) {
      let achievments = ``;

      if (info.achievements && info.achievements.length) {
         for (let i = 0; i < info.achievements.length; i++) {
            let title = i === 0 ? '<div class="title">ACHIEVEMENTS CLUB</div>' : '';
            achievments += `
             <div class="item">
                  ${title}
                  <div class="text">
                      <span>${info.achievements[i].text}</span>
                  </div>
              </div>
            `;
         }
      }
      return `

        ${
           info.name
              ? `<div class="item">
            <div class="title">OFFICIAL NAME</div>
            <div class="text">
                <span>${info.name}</span>
            </div>
        </div>`
              : ''
        }  
        ${
           info.city
              ? ` <div class="item">
            <div class="title">CITY AND FOUNDATION YEAR</div>
            <div class="text">
                <span>${info.city}</span>
            </div>
        </div>`
              : ''
        }  
        ${
           info.stadiumName
              ? ` <div class="item">
            <div class="title">STADIUM</div>
            <div class="text">
                <span>${info.stadiumName}</span>
            </div>
        </div>`
              : ''
        }
        ${
           info.coach
              ? `<div class="item">
            <div class="title">HEAD COACH</div>
            <div class="text">
               <span>${info.coach}</span>
            </div>
        </div>`
              : ''
        }
        <div class="item item-with-list">        
              ${
                 info?.stats?.seasons
                    ? `<div class="list-item">
                         <span class="text-gray">SEASONS IN THE PREMIER LEAGUE</span>
                         <span>${info.stats.seasons}</span>
                     </div>`
                    : ''
              }   
               ${
                  info?.stats?.games
                     ? `<div class="list-item">
                   <span class="text-gray">GAMES IN THE PREMIER LEAGUE</span>
                   <span>${info.stats.games}</span>
               </div>`
                     : ''
               }
               ${
                  info?.stats?.wins
                     ? `<div class="list-item">
                   <span class="text-gray">WINS</span>
                   <span>${info.stats.wins}</span>
               </div>`
                     : ''
               }
               ${
                  info?.stats?.draws
                     ? `<div class="list-item">
                   <span class="text-gray">DRAWS</span>
                   <span>${info.stats.draws}</span>
               </div>`
                     : ''
               }
               ${
                  info?.stats?.loses
                     ? `<div class="list-item">
                   <span class="text-gray">LOSES</span>
                   <span>${info.stats.loses}</span>
               </div>`
                     : ''
               }
             ${
                info?.stats?.scored
                   ? `<div class="list-item">
                   <span class="text-gray">SCORED</span>
                   <span>${info.stats.scored}</span>
               </div>`
                   : ''
             }
               ${
                  info?.stats?.missed
                     ? `<div class="list-item">
                   <span class="text-gray">MISSED</span>
                   <span>${info.stats.missed}</span>
               </div>`
                     : ''
               }
               ${
                  info?.stats?.dry
                     ? `<div class="list-item">
                   <span class="text-gray">DRY</span>
                   <span>${info.stats.dry}</span>
               </div>`
                     : ''
               }
           </div>
         ${achievments}
         ${
            info.url
               ? `<div class="item">
            <div class="title">SITE</div>
            <div class="text">
                <a href="${info.url}">${info.url}</a>
            </div>
        </div>`
               : ''
         }
        ${
           info.email
              ? `<div class="item">
            <div class="title">E-MAIL</div>
            <div class="text">
                <a href="${info.email}">${info.email}</a>
            </div>
        </div>`
              : ''
        }
        ${
           info.address
              ? `<div class="item">
            <div class="title">ADDRESS:</div>
            <div class="text">
                <span>${info.address}</span>
            </div>
        </div>`
              : ''
        }        
        ${
           info.phone
              ? `<div class="item">
            <div class="title">PHONE:</div>
            <div class="text">
                <span>${info.phone}</span>
            </div>
        </div>`
              : ''
        }        
        ${
           info.fax
              ? `<div class="item">
            <div class="title">FAX:</div>
            <div class="text">
                <span>${info.fax}</span>
            </div>
        </div>`
              : ''
        }   
         ${
            info.training_camp
               ? `<div class="item">
            <div class="title">TRAINING CAMP: </div>
            <div class="text">
                <span>${info.training_camp}</span>
            </div>
        </div> `
               : ''
         }                           
      `;
   },
   /**
    * Статистика клуба
    * @param {Object} stat - объект статистики матчей клуба
    */
   getClubStatsItem(stat) {
      return `
         <div class="item">
            <span class="name">${stat.title}</span>
            <span class="num">${stat.value}</span>
        </div>
      `;
   },
   /**
    * Статистика клуба
    * @param {Object} player - объект игрока матчей клуба
    * @param {String} clubImg - сслыка на логотип клуба
    */
   getClubStatsPlayerItem(player, clubImg) {
      return `
         <a href="/players/player_${player.id}.html" class="player-list-item player-list-item_numbers">
                <div class="photo" style="background-image: url(${player.img})"></div>
                <div class="player-info">
                    <img src="${clubImg}" alt="" class="logo">
                    <div class="name">${player.name}</div>
                    <span class="num">${player.value}</span>
                </div>
            </a>
      `;
   },
   /**
    * Статистика игрока
    * @param {Object} item - объект главной статистики
    * @param {Array} labels - массив текстов
    */
   getMainPlayerStatsItem(item, labels) {
      if (!item || !labels) return '';

      let value = +item.value,
         valueLabel = declOfNum(value, labels);

      return `
         <div class="item">
             <span class="num">${value}</span>
             <span class="type">${valueLabel}</span>
         </div>
      `;
   },
   /**
    * Тело игрока(как забивал)
    * @param {Object} data - данные по частям тела
    */
   getPlayerHowGoal(data) {
      return `
        <div class="container">
              <div class="attack-title">How was scored the goal</div>
              <div class="human-wrapper" id="player-how-score">
                  <div class="human"></div>
                  <div class="body-parts">
                      <div class="top left">
                          <div class="num">${data.head}</div>
                          <div class="desc">Head</div>
                      </div>
                      <div class="top right">
                          <div class="num num-null">${data.body}</div>
                          <div class="desc">Body</div>
                      </div>
                      <div class="bottom left">
                          <div class="num num-null">${data.footRight}</div>
                          <div class="desc">Right foot</div>
                      </div>
                      <div class="bottom right">
                          <div class="num">${data.footLeft}</div>
                          <div class="desc">Left foot</div>
                      </div>
                  </div>
               </div>              
      </div>
       
      `;
   },
   /**
    * Формирование точки на воротах
    * @param {Number} all - всего голов
    * @param {Number} count - голы в определенной зоне
    */
   getRoundForZoneGateHTML(all, count) {
      let emptyHTML = '<div class="item"></div>';
      if (!all || !count) return emptyHTML;

      let min = 30,
         max = 70;

      let percent = +count / +all;

      let size = Math.round((max - min) * percent);
      if (!size) return emptyHTML;

      size = count > 1 ? size + min : min;

      return `
         <div class="item">
              <div class="num" style="width: ${size + 'px'}; height: ${size + 'px'};">${count}</div>
          </div>
      `;
   },

   /**
    * Формирование ворот
    * @param {Object} data - html по зонам ворот
    */
   getZoneGateGoal(data) {
      return `
        <div class="container">
                 <div class="attack-title">Where was scored the goal</div>
                 <div class="gate-wrapper" id="player-where-score">
                     <div class="gate">
                         ${data.zltHTML}
                         ${data.zctHTML}
                         ${data.zrtHTML}
                         ${data.zlbHTML}             
                         ${data.zcbHTML}             
                         ${data.zrbHTML}
                     </div>
                  </div>
         </div>
        
      `;
   },

   /**
    * получение HTML точки на футбольном поле по координатам
    * @param {Object} coords - координаты точки
    * @param {String} addClass - доп класс
    */
   getPointFieldHTML(coords, addClass) {
      if (!coords) return '';
      if (!addClass) addClass = '';

      let posY = +coords['pos_x'],
         posX = +coords['pos_y'],
         destY = +coords['dest_x'];

      if (destY === 105) {
         posY = 105 - posY;
         posX = 68 - posX;
      }

      let left = (posX / 68) * 100;
      //т.к. у нас на картинке не всё футбольное поле - получаем % от него!
      let top = (posY / 65) * 100;

      return '<div class="point ' + addClass + '" style="left:' + left + '%; top:' + top + '%"></div>';
   },
   /**
    * Поле с точками, где были забиты голы
    * @param {String} coordsTemplate - html точек
    * @param {Boolean} isGoalkeeper - если для голкипера
    * @param {String} description - Подписи к полю
    */
   getPlayerScoredField(coordsTemplate, isGoalkeeper = false, description = '') {
      let header = ``;
      let desc = ``;
      if (isGoalkeeper) {
         header = `
            <div class="human-header">
                <div class="name">Shots map</div>
            </div>
         `;
         desc = `
            <div class="legend-info">
               ${description}
           </div>
         `;
      }

      return `
        <div class="container">
           <div class="attack-title">Where scored from</div>
               <div class="field-wrap" id="player-field-scored">
                   ${header}
                   <div class="player-field">
                       <div class="first-half"></div>
                        <div class="gate"></div>
                        <div class="center"></div>
                        <div class="second-half">
                            <div class="border"></div>
                            <div class="border right"></div>
                        </div>    
                        ${coordsTemplate}       
                   </div>
                   ${desc}
             </div>   
        </div>
                              
      `;
   },
   /**
    * Формирование разметки для одного матча фитнес блока (Скорость)
    * @param {Object} match - данные матча
    */
   getFitnessSpeedColumn(match) {
      let club1Logo = match.logo1,
         club2Logo = match.logo2,
         goal1 = +match.goal1,
         goal2 = +match.goal2,
         date = match.date,
         speedAverage = match.speedAverage || 0,
         speedMax = match.speedMax || 0;

      let matchDate = '';

      let parseDate = date.split(' ')[0];

      if (date) matchDate = moment(parseDate).format('D MMM YYYY');

      // формируем высоту графиков фитнесс параметров
      let speedLimit = 40,
         speedMaxHeight = (speedMax / speedLimit) * 100,
         speedAverageHeight = (speedAverage / speedLimit) * 100;

      return `
         <div class="graph-col">
              <div class="graph-info">
                  <div class="item" data-info="${speedMax}" style="height: ${speedMaxHeight}%;"></div>
                  <div class="item" data-info="${speedAverage}" style="height: ${speedAverageHeight}%;"></div>
              </div>
              <div class="match-wrap">
                  <div class="info">
                      <div class="logo-team home"><img src="${club1Logo}" alt=""/></div>
                      <div class="score">${goal1}:${goal2}</div>
                      <div class="logo-team away"><img src="${club2Logo}" alt=""/></div>
                  </div>
                  <div class="date">${matchDate}</div>
              </div>
          </div>      
      `;
   },
   /**
    * Формирование разметки для одного матча фитнес блока (Дистанция)
    * @param {Object} match - данные матча
    */
   getFitnessDistanceColumn(match) {
      let club1Logo = match.logo1,
         club2Logo = match.logo2,
         goal1 = +match.goal1,
         goal2 = +match.goal2,
         date = match.date,
         distance = match.distance || 0;

      let matchDate = '';

      let parseDate = date.split(' ')[0];

      if (date) matchDate = moment(parseDate).format('D MMM YYYY');
      // формируем высоту графиков фитнесс параметров

      let distanceLimit = 15,
         distanceHeight = (distance / distanceLimit) * 100;

      return `
          <div class="graph-col">
                 <div class="graph-info">
                     <div class="item" data-info="${distance}" style="height: ${distanceHeight}%;"></div>
                 </div>
                 <div class="match-wrap">
                     <div class="info">
                         <div class="logo-team home"><img src="${club1Logo}" alt=""/></div>
                         <div class="score">${goal1}:${goal2}</div>
                         <div class="logo-team away"><img src="${club2Logo}" alt=""/></div>
                     </div>
                     <div class="date">${matchDate}</div>
                 </div>
             </div>
      `;
   },
   /**
    * Формирование разметки фитнес блока
    * @param {String} template - Матчи для графика
    * @param {Boolean} isDistance - это ли график дистанции
    */
   getFitnessFullTemplate(template, isDistance = false) {
      if (!template.length) return ``;
      let legend = `
              <div class="item max-speed">Maximum speed</div>
             <div class="item average-speed">Average speed</div>
      `;
      if (isDistance) {
         legend = `<div class="item">Дистанция</div>`;
      }

      let header = `
            <div class="line-header">км/ч</div>
              <div class="vertical-line">
                  <div class="divide min">0</div>
                  <div class="divide half-min"></div>
                  <div class="divide middle">20</div>
                  <div class="divide half-middle"></div>
                  <div class="divide max">40</div>
              </div>
      `;
      if (isDistance) {
         header = `
            <div class="line-header">км</div>
              <div class="vertical-line">
                  <div class="divide min">0</div>
                  <div class="divide half-min">5</div>
                  <div class="divide half-middle">10</div>
                  <div class="divide max">15</div>
              </div>
         `;
      }

      return `
         <div class="graph-wrap ${isDistance ? 'distance' : ''}">
             <div class="graph-col graph-header">
                 ${header}
             </div>
             
             ${template}
         </div>
         <div class="legend-info">
             ${legend}
         </div>      
      `;
   },
   /**
    * Базовая строка статистики игрока
    * @param {Object} data - данные
    */
   getBasePlayerEventHTML(data) {
      if (!data) return '';

      let name = data.name || '',
         value = data.value || 0;

      return `
         <div class="player-stats-item">
            <span>${name}</span>
            <span class="num">${value}</span>
         </div>
      `;
   },
   /**
    * Базовая строка статистики игрока
    * @param {Number} yellowCard
    * @param {Number} redCard
    */
   getDisciplineCards(yellowCard, redCard) {
      return `
        <div class="discipline-cards" >
            <div class="item-card yellow">
                 <div class="num">${yellowCard}</div>
             </div>
             <div class="item-card red">
                 <div class="num">${redCard}</div>
             </div>
          </div>
      `;
   },
   /**
    * Возвращает круговой чарт для статистики
    * @param {Object} param - данные
    * @param {Boolean} withPercent - показывать ли проценты
    */
   getChartHtml(param, withPercent) {
      let event1 = param[0],
         event2 = param[1];

      if (event1 && event2) {
         let event1Value = +event1.value,
            event2Name = event2.name,
            event2Value = +event2.value;

         if (event1Value > 0) {
            let param1Percent = Math.floor((event2Value / event1Value) * 100);

            return `
               <div class="item">
                  <div class="circle-item" data-percent="${param1Percent}">
                      <span class="number">${event2Value}</span>
                      ${withPercent ? `<span class="number-percent">${param1Percent}%</span>` : ''}
                  </div>
                  <p class="text">
                      ${event2Name}
                  </p>
              </div>
            `;
         }
      }

      return ``;
   },
   /**
    * Слайд для игрока матча
    * @param {Object} slide - данные
    * @param {String} playerPhoto - фото игрока
    */
   getPlayerOfMatchSlide(slide, playerPhoto) {
      return `
         <div class="swiper-slide">
              <div class="photo" style="background-image: url('${playerPhoto}')"></div>
              <div class="desc">
                  <div class="title">Player of the match</div>
                  <div class="info">
                      <img src="${slide.club1}" alt="" class="logo">
                      <span class="score">${slide.goal1}:${slide.goal2}</span>
                      <img src="${slide.club2}" alt="" class="logo">
                      <span class="week">${slide.stage}</span>
                  </div>
              </div>
          </div>
      `;
   },
   /**
    * Трансфер игрока
    * @param {Object} item - данные
    */
   getPlayerTransferItem(item) {
      let dateFrom = '-';
      let dateTo = 'now';
      let parseDateFrom;
      let parseDateTo;
      if (item.in) parseDateFrom = item.in.split(' ')[0];
      if (item.out) parseDateTo = item.out.split(' ')[0];

      if (parseDateFrom) dateFrom = moment(parseDateFrom).format('D.MM.YYYY');
      if (parseDateTo) dateTo = moment(parseDateTo).format('D.MM.YYYY');

      return `
          <div class="item">
                <img src="${item.logo}" alt="" class="logo">
                <div class="info">
                    <div class="club">${item.club}</div>
                    <div class="position">${item.amplua} — №${item.number}</div>
                    <div class="date">From ${dateFrom} — Till ${dateTo}</div>
                </div>
            </div>
      `;
   },
   /**
    * Статистика - игроки
    * @param {Object} item - данные игрока
    */
   getPlayerStatisticsItem(item, withPadding = false) {
      if (item.rank == 1) {
         return `
             <a href="/players/player_${item.id}.html" class="statistics-item__big club-bg-color-${item.club} ${withPadding ? ' with-padding' : ''}">
                   <div class="bg"></div>
                   <div class="img" style="background-image: url(${item.photo})"></div>
                   <div class="info">
                       <div class="name"><span class="rank">${item.rank}.</span> ${item.name}</div>
                       <div class="club">${item.clubName}</div>
                       <div class="count">${item.count}</div>

                       <div class="club-logo">
                           <img src="${item.clubLogo}" alt="">
                       </div>
                   </div>
               </a>
         `
      }
      return `
         <a href="/players/player_${item.id}.html" class="statistics-item ${withPadding ? ' with-padding' : ''}">
                <div class="info">
                    <img src="${item.clubLogo}" alt="" class="logo">
                    <div class="player">
                        <div class="name"><span class="rank">${item.rank}.</span> ${item.name}</div>
                        <div class="club">${item.clubName}</div>
                    </div>
                </div>
                <span class="count">${item.count}</span>
            </a>
      `;
   },
   /**
    * Статистика - клубы
    * @param {Object} item - данные клуба
    */
   getClubStatisticsItem(item, withPadding = false) {
      if (item.rank == 1) {
         return `
            <a href="/clubs/club_${item.club}.html" class="statistics-item__big-club club-bg-color-${item.club} ${withPadding ? ' with-padding' : ''}">
                   <div class="bg"></div>
                   <div class="info">
                       <img src="${item.logo}" alt="" class="logo">
                       <div class="club">
                           <div class="name"><span class="rank">${item.rank}.</span> ${item.name}</div>
                       </div>
                   </div>
                   <div class="count">${item.count}</div>
               </a>
         `
      }
      return `
         <a href="/clubs/club_${item.club}.html" class="statistics-item ${withPadding ? ' with-padding' : ''}">
                <div class="info">
                    <img src="${item.logo}" alt="" class="logo">
                    <div class="player">
                        <div class="name"><span class="rank">${item.rank}.</span> ${item.name}</div>
                    </div>
                </div>
                <div class="count">${item.count}</div>
            </a>
      `;
   }
};
