// определение амплуа футболиста в зависимости от startingPositionId инстат
// на вход ID амплуа инстут
// возврат ID амплуа футболиста от 0 до 3 согласно РПЛ
export function getAmpluaId(amplua) {
   if (!amplua) return '';

   amplua = +amplua;

   // массивы с ID позиций инстат сгруппированные по амплуа
   var goalkeepers = [31],
      defenders = [12, 22, 32, 42, 52],
      middfielders = [13, 14, 15, 23, 24, 25, 33, 34, 35, 43, 44, 45, 53, 54, 55],
      forwards = [16, 26, 36, 46, 56];

   if (goalkeepers.indexOf(amplua) !== -1) return 0;
   if (defenders.indexOf(amplua) !== -1) return 1;
   if (middfielders.indexOf(amplua) !== -1) return 2;
   if (forwards.indexOf(amplua) !== -1) return 3;

   return '';
}

/**
 * Выбор иконки для события матча
 * @param {String} event - объект события матча
 */
export function getEventItemIcon(event) {
   let img = ``;

   switch (+event.type) {
      case 1:
         img = 'goal.svg';
         break;
      case 2:
         img = 'sub-1.svg';
         break;
      case 3:
         img = 'yellow-card.svg';
         break;
      case 4:
         img = 'red-card.svg';
         break;
      case 43:
         img = 'yellow-red.svg';
         break;
      case 444:
         img = 'var.svg';
         break;
      case 5:
         img = 'penalty-red.svg';
         break;
      case 82:
         img = 'penalty-red.svg';
         break;
      case 10:
         img = 'penalty-green.svg';
         break;
      case 81:
         img = 'penalty-green.svg';
         break;
      case 11:
         img = 'autogoal.svg';
         break;
      default:
         return ``;
   }

   return `<div class="icon">
         <img src="./img/icons/${img}" alt="" class="" />
         ${+event.type === 2 ? `<img src="./img/icons/sub-2.svg" alt="" class="" />` : ''}      
      </div>`;
}

/**
 * Цвет иконки для статистики
 * @param {String} stat - объект статистики
 */
export function getMatchStatClass(stat) {
   let class1 = ``;
   let class2 = ``;

   if (+stat.club1 > +stat.club2) {
      if ([4,5,6,7,14,17,20,21,22,23].indexOf(+stat.type) !== -1) {
         class1 = 'red';
         class2 = 'green';
      } else if ([11].indexOf(+stat.type) !== -1) {
         class1 = 'green';
         class2 = 'green';
      } else if ([13].indexOf(+stat.type) !== -1) {
         class1 = 'gray';
         class2 = 'gray';
      } else {
         class1 = 'green';
         class2 = 'red';
      }
   } else if (+stat.club1 === +stat.club2) {
      if ([11].indexOf(+stat.type) !== -1) {
         class1 = 'green';
         class2 = 'green';
      } else {
         class1 = 'gray';
         class2 = 'gray';
      }

   } else {
      if ([4,5,6,7,14,17,20,21,22,23].indexOf(+stat.type) !== -1) {
         class1 = 'green';
         class2 = 'red';
      } else if ([11].indexOf(+stat.type) !== -1) {
         class1 = 'green';
         class2 = 'green';
      } else if ([13].indexOf(+stat.type) !== -1) {
         class1 = 'gray';
         class2 = 'gray';
      } else {
         class1 = 'red';
         class2 = 'green';
      }
   }

   return { class1, class2 };
}

/**
 * Иконки для результатов матчей
 * @param {String} result - результат матча
 */
export function getMatchResultIcon(result) {
   switch (result) {
      case 'loss':
         return `<div class="state-icon red">L</div>`
      case 'win':
         return `<div class="state-icon green">W</div>`
      case 'draw':
         return `<div class="state-icon gray">D</div>`
   }
}
