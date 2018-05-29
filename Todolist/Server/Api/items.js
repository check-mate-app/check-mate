module.exports = function(app,db){

  //SHOW ALL items
  app.get('/api/items',function(req,res){
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

    let space = `INSERT INTO items(listid,content, done) VALUES (?, ?,?)`;
    db.run(space, [req.body.listid,req.body.content, req.body.done], function(err) {
      if (err) {console.log(err)}

      let ext = 0;
      space =  'SELECT * FROM items WHERE id IN (select max(id) from items)';
      db.each(space, function(err,row){
        if (err){
          console.log(err)
        }
        let itemID = row.id;

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
      console.log("deleted item with id of: " + id);
      res.send({})
    });

//update content
app.put('/api/items/:id', function(req, res) {

  id = req.params.id;

  console.log("should rename item to: " + req.body.content)
  console.log(req.body)

  space = "UPDATE items SET content=" + "'" + req.body.content + "'" + " WHERE id =" + (id.toString());
  db.run(space, function(err) {
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

//mark item as done
app.put('/api/items/:id/done',function(req,res){
  space = "UPDATE items SET done= 1 WHERE id = " + "'" + req.params.id + "'";
  db.run(space, function(err){
    if (err){console.log(err)}
    res.send([]);
  });
});

//mark item as undone
app.put('/api/items/:id/undone',function(req,res){
  space = "UPDATE items SET done= 0 WHERE id = " + "'" + req.params.id + "'";
  db.run(space, function(err){
    if (err){console.log(err)}
    res.send([]);
  });
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
