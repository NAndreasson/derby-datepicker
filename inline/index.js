var moment = require('moment');

module.exports = InlineDatepicker;

function InlineDatepicker() {}
InlineDatepicker.prototype.view = __dirname;

InlineDatepicker.prototype.init = function(model) {
  var currentDate = moment();

  this.updateCurrentDate(currentDate);
  this.createDayView(currentDate.year(), currentDate.month());
  this.dayView();
};

InlineDatepicker.prototype.gotoDayView = function(date) {
  var date = moment(date);

  this.updateCurrentDate(date);
  this.createDayView(date.year(), date.month());
  this.dayView();
};

// TODO add month as argument (if no month passed, use currentDate)
InlineDatepicker.prototype.dayView = function() {
  var model = this.model;
  model.set('view', 'days');
};

InlineDatepicker.prototype.monthView = function() {
  var model = this.model;

  this.createMonthView();

  model.set('view', 'months');
};

InlineDatepicker.prototype.createMonthView = function() {
  var model = this.model;

  var months = [];

  var date = moment({ month: 0 });

  for (var i = 0; i < 12; i++) {
    months.push({ abbr: date.format('MMM'), date: date.format('YYYY-MM') });
    date.add('months', 1);
  }

  model.set('months', months);
};

InlineDatepicker.prototype.updateCurrentDate = function(currentDate) {
  var model = this.model;
  model.set('currentDate', currentDate);
};

InlineDatepicker.prototype.getCurrentDate = function() {
  var model = this.model;
  return model.get('currentDate').clone();
}

InlineDatepicker.prototype.getMonth = function(currentDate) {
  return currentDate.format('MMMM');
};

InlineDatepicker.prototype.getYear = function(currentDate) {
  return currentDate.format('YYYY');
};

InlineDatepicker.prototype.select = function(selectedDate) {
  var model = this.model;

  model.set('active', selectedDate.fullDate);
};

InlineDatepicker.prototype.activeDate = function(active, date) {
  var model = this.model;
  var active = model.get('active');

  return active === date;
};

InlineDatepicker.prototype.activeMonth = function(active, date) {
  // check if active is the same year and month as monthDate
  var activeDate = moment(active);
  var date = moment(date);

  return activeDate.year() === date.year() &&
          activeDate.month() === date.month();
};

InlineDatepicker.prototype.prevMonth = function() {
  var model = this.model;
  // get current month
  var currentDate = model.get('currentDate').clone();
  // calculate previous month from date
  var prevMonthDate = currentDate.subtract('months', 1);

  this.createDayView(prevMonthDate.year(), prevMonthDate.month());
  this.updateCurrentDate(prevMonthDate);
  // update current date
  // updatedateView with month
};

InlineDatepicker.prototype.nextMonth = function() {
  var model = this.model;
  // get current month
  var currentDate = model.get('currentDate').clone();
  // calculate previous month from date
  var nextMonthDate = currentDate.add('months', 1);

  this.createDayView(nextMonthDate.year(), nextMonthDate.month());
  this.updateCurrentDate(nextMonthDate);
  // update current date
  // updatedateView with month
};

InlineDatepicker.prototype.createDayView = function(year, month) {
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

  model.set('weeks', weeks);

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