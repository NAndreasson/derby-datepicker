var util = require('util');
var moment = require('moment');
var ViewHelpers = require('./viewHelpers').ViewHelpers;

module.exports = Datepicker;

function Datepicker() {}

util.inherits(Datepicker, ViewHelpers);

Datepicker.prototype.view = __dirname;

Datepicker.prototype.init = function(model) {
  var currentDate = new Date();

  this.gotoMonthView( currentDate );
};

Datepicker.prototype.gotoMonthView = function(date) {
  var date = moment(date);

  this.setCurrentDate(date);
  this.monthView(date);
};

// TODO add month as argument (if no month passed, use currentDate)
Datepicker.prototype.monthView = function(date) {
  var model = this.model;

  if ( !date ) return;

  var date = moment(date);
  var weeks = this.buildMonthView(date.year(), date.month());

  model.set('weeks', weeks);
  model.set('view', 'month');
};

Datepicker.prototype.gotoYearView = function(year) {
  var date = moment({ year: year });

  this.setCurrentDate(date);
  this.yearView(date);
};

Datepicker.prototype.yearView = function(date) {
  var model = this.model;
  var months = this.buildYearView(date);

  model.set('months', months);
  model.set('view', 'year');
};

Datepicker.prototype.buildYearView = function(date) {
  var model = this.model;
  var months = [];
  var month = date.clone().month(0);

  for (var i = 0; i < 12; i++) {
    months.push({ abbr: month.format('MMM'), date: month.format('YYYY-MM') });
    month.add('months', 1);
  }

  return months;
};

Datepicker.prototype.nextYear = function() {
  var model = this.model;
  // get current month
  var currentDate = this.getCurrentDate();
  // calculate previous year from date
  var nextYearDate = currentDate.add('years', 1);
  this.gotoYearView(nextYearDate.year());
};

Datepicker.prototype.prevYear = function() {
  var model = this.model;
  // get current month
  var currentDate = this.getCurrentDate();
  // calculate previous year from date
  var prevYearDate = currentDate.subtract('years', 1);
  this.gotoYearView(prevYearDate.year());
};

Datepicker.prototype.gotoDecadeView = function(date) {
  var date = moment(date);

  this.setCurrentDate(date);
  this.decadeView(date);
};

Datepicker.prototype.decadeView = function(date) {
  var model = this.model;
  var years = this.buildDecadeView(date);

  model.set('years', years);
  model.set('view', 'decade');
};

Datepicker.prototype.buildDecadeView = function(date) {
  var model = this.model;
  var years = [];
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
};

Datepicker.prototype.prevDecade = function() {
  var model = this.model;

  var currentDate = this.getCurrentDate();
  var prevDecadeDate = currentDate.subtract('years', 10);

  this.gotoDecadeView(prevDecadeDate);
};

Datepicker.prototype.nextDecade = function() {
  var model = this.model;

  var currentDate = this.getCurrentDate();
  var nextDecadeDate = currentDate.add('years', 10);

  this.gotoDecadeView(nextDecadeDate);
};

Datepicker.prototype.select = function(selectedDate) {
  var model = this.model;

  var date = moment(selectedDate.fullDate);
  var selectedMonth = date.month();
  var currentMonth = this.getCurrentDate().month();

  if ( selectedMonth !== currentMonth ) this.gotoMonthView(date);

  model.set('active', selectedDate.fullDate);
};

Datepicker.prototype.prevMonth = function() {
  var model = this.model;
  // get current month
  var currentDate = this.getCurrentDate();
  // calculate previous month from date
  var prevMonthDate = currentDate.subtract('months', 1);

  this.gotoMonthView(prevMonthDate);
};

Datepicker.prototype.nextMonth = function() {
  var model = this.model;
  // get current month
  var currentDate = this.getCurrentDate();
  // calculate previous month from date
  var nextMonthDate = currentDate.add('months', 1);

  this.gotoMonthView(nextMonthDate);
};

Datepicker.prototype.buildMonthView = function(year, month) {
  var model = this.model;

  var currentDate = moment({ year: year, month: month });

  var datesFromPrevMonth = addExtraDaysFromPrevMonth(currentDate.clone());
  var datesInCurrentMonth = getDaysInCurrentMonth(currentDate.clone());
  var datesFromNextMonth = addExtraDaysFromNextMonth(currentDate.clone());

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
};

Datepicker.prototype.setCurrentDate = function(currentDate) {
  var model = this.model;
  model.set('currentDate', currentDate.clone());
};

Datepicker.prototype.getCurrentDate = function() {
  var model = this.model;
  return model.get('currentDate').clone();
}
