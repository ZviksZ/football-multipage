import * as $ from 'jquery';
import './sex_by_russian_name';

/**
 * Форматирования числа в денежный формат
 * @param {Number} number - число для форматирования
 * @param {Number} decimals - знаков после запятой
 * @param {String} decPoint - разделитель для float
 * @param {String} thousandsSep - разделить разрядов
 * @returns {string} число в денежном формате
 */
function numberFormat(number, decimals = 0, decPoint = '', thousandsSep = ' ') {
   let i, j, kw, kd, km;

   i = parseInt((number = (+number || 0).toFixed(decimals))) + '';
   if ((j = i.length) > 3) {
      j = j % 3;
   } else {
      j = 0;
   }
   km = j ? i.substr(0, j) + thousandsSep : '';
   kw = i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousandsSep);
   kd = decimals
      ? decPoint +
        Math.abs(number - i)
           .toFixed(decimals)
           .replace(/-/, 0)
           .slice(2)
      : '';
   return km + kw + kd;
}

/**
 * Фукнция склонения
 * @param {Number} number - число для склонения
 * @param {Array} titles - массив слов склонений
 * @returns {String} подпись
 */
function declOfNum(number, titles) {
   const cases = [2, 0, 1, 1, 1, 2];
   return titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]];
}

/**
 * Получение GET параметров из URL
 * @returns {Object} - объект с гет параметрами
 */
function parseGets() {
   let a = location.search;
   a = a.substring(1).split('&');
   const b = {};
   for (let i = 0; i < a.length; i++) {
      let c = a[i].split('=');
      b[c[0]] = c[1];
   }
   return b;
}

/**
 * Переключатели скрытого контента
 */
function initToggleBlock() {
   $('.toggle-block')
      .not('.toggle-block-ready')
      .on('click', '.toggle-button', function () {
         $(this).parents('.toggle-block').toggleClass('open');
         return false;
      });

   $('.toggle-block').addClass('toggle-block-ready');
}

/**
 * Форматирование даты
 * @param {Date} date - объект JS даты
 * @param {Number} [type] - какой вариант форматирования
 * @return {String} дата в указанном формате
 */
function formatDate(date, type = 0) {
   if (!date) return '';

   const monthsClassificator = ['', 'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];

   const day = +date.getDate();
   const month = +date.getMonth() + 1;
   const year = +date.getFullYear();

   let dayText = day;
   if (day < 10) dayText = `0${dayText}`;

   let monthText = month;
   if (month < 10) monthText = `0${monthText}`;

   let yearText = year;

   let result = '';
   switch (type) {
      case 1:
         // дата в формате 06 марта 2020
         result = `${dayText} ${monthsClassificator[month].toLowerCase()} ${year}`;
         break;

      case 0:
      default:
         result = `${dayText}.${monthText}.${yearText}`;
   }

   return result;
}

/**
 * Определение пола по ФИО
 * @param {String} lastname - фамилия
 * @param {String} name - имя
 * @param {String} patronymic - отчество
 * @return {number} 1 - мужской, 2 - женский, все неопределенные идут как 1))
 */
function getGenderByFIO(lastname = '', name = '', patronymic = '') {
   const sexByRussianName = new SexByRussianName(lastname, name, patronymic);
   let gender = +sexByRussianName.get_gender();
   if (gender === 0) {
      gender = 2;
   } else {
      gender = 1;
   }

   return gender;
}

/**
 * Подсветка подстроки в строке
 * @param {String} needle - строка, которую нужно найти в тексте
 * @param {String} node - элемент, в котором происходит замена
 */
function highlightSomeText(needle, node) {
   node = node || document.body;
   if (node.classList && node.classList.contains('section-title')) return;

   if (node.nodeName == 'SCRIPT') return;

   if (node.nodeType == 3) {
      let parts = node.nodeValue.split(new RegExp('(' + needle + ')', 'i'));
      if (parts.length > 1) {
         let parent = node.parentNode;
         for (let i = 0, l = parts.length; i < l; ) {
            let newText = document.createTextNode(parts[i++]);
            parent.insertBefore(newText, node);
            if (i != l) {
               let newSpan = document.createElement('span');
               newSpan.className = 'search-highlight';
               newSpan.innerHTML = parts[i++];
               parent.insertBefore(newSpan, node);
            }
         }
         parent.removeChild(node);
      }
   }

   for (let i = node.childNodes.length; i--; ) {
      highlightSomeText(needle, node.childNodes[i]);
   }
}

/**
 * Получение ID из URL вида /path/id
 * @returns {String} - полученный ID
 */
function getIdFromURL() {
   const url = location.pathname;
   const urlArr = url.split('/');
   return urlArr[urlArr.length - 1];
}

function kFormatter(num) {
   return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'K' : Math.sign(num)*Math.abs(num)
}
// получения текстового названия дат
// на вход объект даты, тип форматирования и флаг локального часового пояса
function transformDate(date, type, localTimezone) {
   if (!date) return '';

   if (!type) type = 1;

   // итоговая дата
   var dateResult = '';

   // дата которую нужно преобразовать
   var dateTransform = getDateObject(date, localTimezone);

   var dateTransformDay = dateTransform.getDate(),
      dateTransformMonth = dateTransform.getMonth(),
      dateTransformYear = dateTransform.getFullYear(),
      dateTransformWeekday = dateTransform.getDay(),
      dateTransformMonthName = getMonthNameDecl(dateTransformMonth),
      dateTransformMonthNameShort = getMonthNameShortDecl(dateTransformMonth),
      dateTransformWeekdayName = getWeekdayName(dateTransformWeekday);

   // текущая дата
   var nowDate = getDateObject(null, localTimezone);

   var nowDay = nowDate.getDate(),
      nowMonth = nowDate.getMonth(),
      nowYear = nowDate.getFullYear(),
      nowWeekday = nowDate.getDay();

   // в зависимости от разных типов форматируем вывод
   switch (type) {
      case 1:
         // пятница, 19 мая || вчера, 20 мая || сегодня, 21 мая || завтра, 22 мая
         // получаем разницу между трансформируемой и текущей датой - значение в днях без учета времени!
         var _dateTransform = new Date(dateTransformYear, dateTransformMonth, dateTransformDay),
            _dateNow = new Date(nowYear, nowMonth, nowDay),
            diffMs = +_dateTransform - +_dateNow,
            diffDays = Math.floor(diffMs / 1000 / 60 / 60 / 24);

         var dateLabel = '';
         if (diffDays === -1) {
            dateLabel = 'Вчера';

         } else if (diffDays === 0) {
            dateLabel = 'Сегодня';

         } else if (diffDays === 1) {
            dateLabel = 'Завтра';

         } else {
            dateLabel = dateTransformWeekdayName;
         }

         dateResult = dateLabel + ', ' + dateTransformDay + ' ' + dateTransformMonthName.toLowerCase();

         break;

      case 2:
         // время 17:30
         var hours = +dateTransform.getHours(),
            minutes = +dateTransform.getMinutes();

         if (hours < 10) hours = '0' + hours;
         if (minutes < 10) minutes = '0' + minutes;

         dateResult = hours + ':' + minutes;

         break;

      case 3:
         // 5 секунд назад, 2 минуты назад, 2 часа назад, 16 часов назад, 16 апреля 2019
         // получаем разницу между трансформируемой и текущей датой - значение в днях без учета времени!
         // если разница более 1 дня - формируем обычную дату, иначе получаем разницу с учетом времени
         // и формируем значение N часов/минут/секунд назад
         var _dateTransform = new Date(dateTransformYear, dateTransformMonth, dateTransformDay),
            _dateNow = new Date(nowYear, nowMonth, nowDay),
            _diffMs = +_dateNow - +_dateTransform,
            diffDays = Math.floor(_diffMs / 1000 / 60 / 60 / 24);

         if (diffDays >= 1) {
            dateResult = dateTransformDay + ' ' + dateTransformMonthName + ' ' + dateTransformYear;

         } else {
            // получаем разницу между трансформируемой датой и текущей с учетом времени!
            var diffMs = +nowDate - +dateTransform;

            // если
            // разница часах, минутах, секундах
            var diffHours = diffMs / 1000 / 60 / 60,
               diffMinutes =  diffMs / 1000 / 60,
               diffSeconds =  diffMs / 1000;

            if (diffHours >= 1) {
               var _hours = Math.floor(diffHours);
               dateResult = _hours + ' ' + declOfNum(_hours, ['час', 'часа', 'часов']) + ' назад';

            } else if (diffMinutes >= 1) {
               var _minutes = Math.floor(diffMinutes);
               dateResult = _minutes + ' ' + declOfNum(_minutes, ['минуту', 'минуты', 'минут']) + ' назад';

            } else {
               var _seconds = Math.floor(diffSeconds);
               dateResult = _seconds + ' ' + declOfNum(_seconds, ['секунду', 'секунды', 'секунд']) + ' назад';
            }
         }


         break;
      case 4:
         // 26 мая 2019
         dateResult = dateTransformDay + ' ' + dateTransformMonthName + ' ' + dateTransformYear;

         break;
      case 5:
         // 26 авг.
         dateResult = dateTransformDay + ' ' + dateTransformMonthNameShort;

         break;

      case 6:
         // 03.06.2019
         var monthResult = dateTransformMonth + 1;

         if (monthResult < 10) monthResult = '0' + monthResult;
         if (dateTransformDay < 10) dateTransformDay = '0' + dateTransformDay;

         dateResult = dateTransformDay + '.' + monthResult + '.' + dateTransformYear;

         break;

      case 7:
         // 26 авг. 2019
         dateResult = dateTransformDay + ' ' + dateTransformMonthNameShort + ' ' + dateTransformYear;

         break;
   }

   return dateResult;
}

export {
   numberFormat,
   declOfNum,
   parseGets,
   initToggleBlock,
   formatDate,
   getGenderByFIO,
   highlightSomeText,
   getIdFromURL,
   kFormatter,
   transformDate
};
