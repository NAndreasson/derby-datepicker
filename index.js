module.exports = function(app, options) {
  app.component(require('./inline'));
  app.loadStyles(__dirname + '/style.css');
};