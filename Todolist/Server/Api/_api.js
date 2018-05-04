module.exports = function (app, db) {
  require('./lists.js')(app, db);
  require('./items.js')(app,db);
}
