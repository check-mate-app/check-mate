module.exports = function (app, db) {

  //SHOW LISTS
  app.get('/api/lists', function(req, res) {
    db.all(`select l.*, (select count(i.id) from items i where i.listid = l.id ) as items,(select count(i.id) from items i where i.listid = l.id  and i.done = 1) as done from lists l group by l.id;`, function(err, rows) {
      if (err) {
        console.error(err.message);
      } else {
        res.send(rows);
      }
    });
  });

  app.get('/api/lists/favorites', function(req, res) {
    db.all(`select l.*, (select count(i.id) from items i where i.listid = l.id ) as items,(select count(i.id) from items i where i.listid = l.id  and i.done = 1) as done from lists l where favorite = 1 group by l.id;`, function(err, rows) {
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
    res.send({})
  });


  //GET LIST BY ID
  app.get('/api/lists/:id', function(req, res) {
    id = req.params.id;
    space = "select l.*, (select count(i.id) from items i where i.listid = l.id ) as items,(select count(i.id) from items i where i.listid = l.id  and i.done = 1) as done from lists l WHERE l.id = " + id.toString() + " group by l.id;";
    db.each(space, function(err, row) {
      if (err) {console.log(err)}
      res.send(row);
    })
  });

  //UPDATE

  app.put('/api/lists/:id', function(req, res) {

    id = req.params.id;

    space = "UPDATE lists SET name=" + "'" + req.body.name + "'" + ", color=" + "'" + req.body.color + "'"+ ", icon=" + "'" + req.body.icon + "'"+ ", favorite=" + "'" + req.body.favorite + "'" + "  WHERE id =" + (id.toString());
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
    let space = `INSERT INTO lists(name, icon, owner, color ) VALUES (?, ?, ?, ?)`;
    db.run(space, [req.body.name, req.body.icon, req.body.owner, req.body.color], function(err) {
      if (err) {
        console.log(err);
      }
    });
    space = "SELECT * FROM lists WHERE name = " + "'" + req.body.name + "'";
    db.all(space, function(err, rows) {
      if (err) {
        console.log(err)
      };
      res.send(rows);
    })
  });


  //needed: function that counts a lists items and how many are done
}
