module.exports = function (app, db) {
  require('./lists.js')(app, db);
  require('./items.js')(app,db);
  require('./item_list_relation.js')(app,db);
}
