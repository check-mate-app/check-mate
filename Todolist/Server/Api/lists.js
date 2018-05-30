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
    res.send({})
  });


  //GET LIST BY ID
  app.get('/api/lists/:id', function(req, res) {
    id = req.params.id;
      let itemNumber = [];
      let itemsDone = [];

      space ='SELECT * FROM items WHERE listid = "'+req.params.id+'"';
      db.each(space,function(err,row){
        if(err){console.log(err)}
        itemNumber.push(row.id)
      })

      space ='SELECT * FROM items WHERE listid = "'+req.params.id+'" AND done = 1';
      db.each(space,function(err,row){
        if(err){console.log(err)}
        itemsDone.push(row.id)
      })

      setTimeout(function(){}, 10);

    space = "SELECT * FROM lists WHERE id =" + (id.toString());
    db.each(space, function(err, row) {
      if (err) {console.log(err)}
      res.send([row,"items: " + itemNumber.length, "done: "+itemsDone.length]);
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
    let space = `INSERT INTO lists(name, icon, owner, color ) VALUES (?, ?, ?, ?)`;
    db.run(space, [req.body.name, req.body.icon, req.body.owner, 0], function(err) {
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
