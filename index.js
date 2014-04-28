module.exports = function(app, options) {
  app.component(require('./datepicker'));
  app.loadStyles(__dirname + '/style.css');
};