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
