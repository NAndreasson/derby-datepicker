var moment = require('moment');

function ViewHelpers() {}

ViewHelpers.prototype.getMonth = function(currentDate) {
  return moment(currentDate).format('MMMM');
};

ViewHelpers.prototype.getYear = function(currentDate) {
  return moment(currentDate).format('YYYY');
};

ViewHelpers.prototype.getDecadeRange = function(currentDate) {
  var currentYear = moment(currentDate).year();
  var yearInDecade = currentYear % 10;

  var firstYearInDecade = currentYear - yearInDecade;
  var lastYearInDecade = firstYearInDecade + 9;
  return firstYearInDecade + ' - ' + lastYearInDecade;
};

ViewHelpers.prototype.activeDate = function(active, date) {
  var model = this.model;
  var active = model.get('active');

  return active === date;
};

ViewHelpers.prototype.activeMonth = function(active, date) {
  // check if active is the same year and month as monthDate
  var activeDate = moment(active);
  var date = moment(date);

  return activeDate.year() === date.year() &&
          activeDate.month() === date.month();

};

ViewHelpers.prototype.activeYear = function(active, year) {
  var activeDate = moment(active);
  var yearDate = moment({ year: year });

  return activeDate.year() === yearDate.year();
};

exports.ViewHelpers = ViewHelpers;