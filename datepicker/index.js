var util = require('util');
var moment = require('moment');
var ViewHelpers = require('./viewHelpers').ViewHelpers;
var builders = require('./builders');

module.exports = Datepicker;

function Datepicker() {}

util.inherits(Datepicker, ViewHelpers);

Datepicker.prototype.view = __dirname;

Datepicker.prototype.init = function(model) {
  var currentDate = new Date();

  this.gotoMonthView(currentDate);
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
  var weeks = builders.buildMonthView(date);

  model.set('weeks', weeks);
  model.set('view', 'month');
};

Datepicker.prototype.gotoYearView = function(date) {
  var date = moment(date, 'YYYY-MM-DD');

  this.setCurrentDate(date, 'YYYY-MM-DD');
  this.yearView(date);
};

Datepicker.prototype.yearView = function(date) {
  var model = this.model;
  var months = builders.buildYearView(date);

  model.set('months', months);
  model.set('view', 'year');
};

Datepicker.prototype.nextYear = function() {
  var model = this.model;
  // get current month
  var currentDate = moment(this.getCurrentDate());
  // calculate previous year from date
  var nextYearDate = currentDate.add('years', 1);
  this.gotoYearView(nextYearDate);
};

Datepicker.prototype.prevYear = function() {
  var model = this.model;
  // get current month
  var currentDate = moment(this.getCurrentDate());
  // calculate previous year from date
  var prevYearDate = currentDate.subtract('years', 1);
  this.gotoYearView(prevYearDate);
};

Datepicker.prototype.gotoDecadeView = function(date) {
  var date = moment(date);

  this.setCurrentDate(date);
  this.decadeView(date);
};

Datepicker.prototype.decadeView = function(date) {
  var model = this.model;
  var years = builders.buildDecadeView(date);

  model.set('years', years);
  model.set('view', 'decade');
};

Datepicker.prototype.prevDecade = function() {
  var model = this.model;

  var currentDate = moment(this.getCurrentDate());
  var prevDecadeDate = currentDate.subtract('years', 10);

  this.gotoDecadeView(prevDecadeDate);
};

Datepicker.prototype.nextDecade = function() {
  var model = this.model;

  var currentDate = moment(this.getCurrentDate());
  var nextDecadeDate = currentDate.add('years', 10);

  this.gotoDecadeView(nextDecadeDate);
};

Datepicker.prototype.select = function(selectedDate) {
  var model = this.model;

  var date = moment(selectedDate.fullDate);
  var selectedMonth = date.month();
  var currentDate = moment(this.getCurrentDate());
  var currentMonth = currentDate.month();

  if ( selectedMonth !== currentMonth ) this.gotoMonthView(date);

  model.set('active', selectedDate.fullDate);
};

Datepicker.prototype.prevMonth = function() {
  var model = this.model;
  // get current month
  var currentDate = moment(this.getCurrentDate());
  // calculate previous month from date
  var prevMonthDate = currentDate.subtract('months', 1);

  this.gotoMonthView(prevMonthDate);
};

Datepicker.prototype.nextMonth = function() {
  var model = this.model;
  // get current month
  var currentDate = moment(this.getCurrentDate());
  // calculate previous month from date
  var nextMonthDate = currentDate.add('months', 1);

  this.gotoMonthView(nextMonthDate);
};

Datepicker.prototype.setCurrentDate = function(currentDate) {
  var model = this.model;
  model.set('currentDate', currentDate);
};

Datepicker.prototype.getCurrentDate = function() {
  var model = this.model;
  return model.get('currentDate');
}
