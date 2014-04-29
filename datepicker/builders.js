var moment = require('moment');

exports.buildYearView = buildYearView;
function buildYearView (date) {
  var model = this.model;
  var months = [];
  var month = moment(date).month(0);

  for (var i = 0; i < 12; i++) {
    months.push({ abbr: month.format('MMM'), date: month.format('YYYY-MM') });
    month.add('months', 1);
  }

  return months;
};


exports.buildDecadeView = buildDecadeView;
function buildDecadeView(date) {
  var model = this.model;
  var years = [];
  var date = moment(date);
  var currentYear = date.year();
  // how far into the decade are we, eg 1 year for 2011
  var yearsIntoDecade = currentYear % 10;
  // subract the number of years into the decade, and 1 more so for 2011 we want to start from 2009
  var year = date.subtract('years', yearsIntoDecade + 1);

  for (var i = 0; i <= 11; i++) {
    var yearInDecade = i > 0 && i < 11;
    years.push({ year: year.year(), inDecade: yearInDecade });
    year.add('years', 1);
  }

  return years;
}



exports.buildMonthView = buildMonthView;
function buildMonthView(date) {
  var model = this.model;

  var date = moment(date);

  var datesFromPrevMonth = addExtraDaysFromPrevMonth(date.clone());
  var datesInCurrentMonth = getDaysInCurrentMonth(date.clone());
  var datesFromNextMonth = addExtraDaysFromNextMonth(date.clone());

  var allDates = datesFromPrevMonth.concat(datesInCurrentMonth, datesFromNextMonth);

  // split all dates up
  var weeks = [];

  while (allDates.length > 0) {
    weeks.push(allDates.splice(0, 7));
  }

  return weeks;

  function getDaysInCurrentMonth(currentDate) {
    var dates = [];

    // initially set date to first day of month
    var date = currentDate.date(1);
    var nrDaysInMonth = currentDate.daysInMonth();

    for (var i = 1; i <= nrDaysInMonth; i++) {
      dates.push( getDateObj( date, true ) );
      date.add('days', 1);
    }

    return dates;
  }

  function addExtraDaysFromPrevMonth(currentDate) {
    var dates = [];

    var firstDateOfMonth = currentDate.clone().date(1);
    var firstDayOfMonth = firstDateOfMonth.day();

    for (var i = 0; i < firstDayOfMonth; i++) {
      var prevDay = firstDateOfMonth.subtract('days', 1);

      dates.unshift( getDateObj( prevDay, false ) );
    }

    return dates;
  }

  function addExtraDaysFromNextMonth(currentDate) {
    var dates = [];

    var daysInMonth = currentDate.daysInMonth();
    var lastDastDayOfMonth = currentDate.date(daysInMonth);

    for (var i = lastDastDayOfMonth.day(); i < 6; i++) {
      var nextDay = lastDastDayOfMonth.add('days', 1);

      dates.push( getDateObj( nextDay, false ) );
    }

    return dates;
  }

  function getDateObj(date, isCurrentMonth) {
    return {
      date: date.date(),
      fullDate: date.format('YYYY-MM-DD'),
      thisMonth: isCurrentMonth
    }
  }
}