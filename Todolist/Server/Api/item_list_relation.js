module.exports = function (app, db) {
  //SHOW ALL items
  app.get('/api/item_list_relation/',function(req,res){
    db.all(`SELECT * FROM item_list_relation`, function(err, rows) {
      if (err) {
        console.error(err.message);
      } else {
        res.send(rows);
      }
    });
  });
}
