module.exports = function(app,db){

  //SHOW ALL items
  app.get('/api/items/',function(req,res){
    db.all(`SELECT * FROM items`, function(err, rows) {
      if (err) {
        console.error(err.message);
      } else {
        res.send(rows);
      }
    });
  });

  //ADD item

  app.post('/api/items', function(req, res) {
    console.log(req.body.listID);
    let listID = req.body.listID;

    let space = `INSERT INTO items(content, done) VALUES (?, ?)`;
    db.run(space, [req.body.content, req.body.done], function(err) {
      if (err) {console.log(err)}

      let ext = 0;
      space =  'SELECT * FROM items WHERE id IN (select max(id) from items)';
      db.each(space, function(err,row){
        if (err){
          console.log(err)
        }
        let itemID = row.id;

        space = 'INSERT INTO item_list_relation( list_id, item_id) VALUES(?, ?)';
        db.run(space, [listID,itemID], function(err){
          if(err){console.log(err)}
          console.log("ILR REQ BODY ID "+listID);
          console.log("function "+ itemID);
        })
      })
    })

    //ausgabe
    space = "SELECT * FROM items WHERE id = " + "'" + req.body.name + "'";
    db.all(space, function(err, rows) {
      if (err) {
        console.log(err)
      };
      console.log("log");
      res.send(rows);
    })
  });

}
