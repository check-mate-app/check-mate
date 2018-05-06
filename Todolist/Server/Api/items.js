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
    //content
    //done
    //list id
      res.send([]);
    })

    //del item by id
    app.delete('/api/items/:id', function(req, res) {

      var id = req.params.id;
      space = "DELETE FROM items WHERE id =" + (id.toString());
      db.run(space, function(err) {
        if (err) {
          console.log(err)
        }
      })
      space = "DELETE FROM item_list_relation WHERE item_id="+(id.toString());
      db.run(space, function(err){
        if (err){console.log(err)}
      })
      console.log("deleted item with id of: " + id);
      res.send({})
    });

//update content
app.put('/api/items/:id', function(req, res) {

  id = req.params.id;

  space = "UPDATE items SET content=" + "'" + req.body.content + "'" + " WHERE id =" + (id.toString());
  db.all(space, function(err, rows) {
    if (err) {
      console.log(err)
    };
  })
  space = "SELECT * FROM items WHERE id = " + "'" + req.params.id + "'";
  db.all(space, function(err, rows) {
    if (err) {
      console.log(err)
    };
    res.send(rows);
  })
});

//gett item by id
app.get('/api/items/:id', function(req, res) {
  id = req.params.id;
  space = "SELECT * FROM items WHERE id =" + (id.toString());
  db.all(space, function(err, rows) {
    if (err) {
      console.log(err)
    };
    res.send(rows);
    //missing: items on the list are not included in res.send yet
  })
});


}
