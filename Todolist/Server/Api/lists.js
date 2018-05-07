module.exports = function (app, db) {

  //SHOW LISTS
  app.get('/api/lists', function(req, res) {
    db.all(`SELECT * FROM lists`, function(err, rows) {
      if (err) {
        console.error(err.message);
      } else {
        res.send(rows);
      }
    });
  });



  ////DELETE
  app.delete('/api/lists/:id', function(req, res) {

    var id = req.params.id;
    space = "DELETE from lists WHERE id =" + (id.toString());
    db.run(space, function(err) {
      if (err) {
        console.log(err)
      }
    })
    console.log("deleted item with id of: " + id);
    res.send({})
  });


  //GET LIST BY ID
  app.get('/api/lists/:id', function(req, res) {
    id = req.params.id;
    console.log("ID " + id);

    space = "SELECT * FROM lists WHERE id =" + (id.toString());
    db.all(space, function(err, rows) {
      if (err) {
        console.log(err)
      };
      console.log("log");
      res.send(rows);
      //missing: items on the list are not included in res.send yet
    })
  });

  //UPDATE

  app.put('/api/lists/:id', function(req, res) {

    id = req.params.id;

    space = "UPDATE lists SET name=" + "'" + req.body.name + "'" + " WHERE id =" + (id.toString());
    db.all(space, function(err, rows) {
      if (err) {
        console.log(err)
      };
    })
    space = "SELECT * FROM lists WHERE name = " + "'" + req.body.name + "'";
    db.all(space, function(err, rows) {
      if (err) {
        console.log(err)
      };
      console.log("log");
      res.send(rows);
    })

  });

//send all items belonging to a list
app.get('/api/lists/:listid/items',function(req,res){

space = 'SELECT * FROM items WHERE listid='+req.params.listid;
db.all(space,function(err,rows){
  if (err){console.log(err)}
  res.send(rows);
})

});


  //ADD
  app.post('/api/lists', function(req, res) {
    console.log(req.body);
    let space = `INSERT INTO lists(name, icon, owner) VALUES (?, ?, ?)`;
    db.run(space, [req.body.name, req.body.icon, req.body.owner], function(err) {
      if (err) {
        console.log(err);
      }
    });
    space = "SELECT * FROM lists WHERE name = " + "'" + req.body.name + "'";
    db.all(space, function(err, rows) {
      if (err) {
        console.log(err)
      };
      console.log("log");
      res.send(rows);
    })
  });
}
