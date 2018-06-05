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
    space = "DELETE from lists WHERE owner ="+req.session.id+" AND id =" + (id.toString());
    db.run(space, function(err) {
      if (err) {
        console.log(err)
      }
    })
    res.send({})
  });


  //GET LIST BY FAVORITES
  app.get('/api/lists/favorites', function(req, res) {
    space = `
    select l.*,
      (select count(i.id) from items i where i.listid = l.id ) as items,
      (select count(i.id) from items i where i.listid = l.id  and i.done = 1) as done
    from lists l
    inner join collaborators c on c.listid = l.id
    where c.userid = ${req.session.id} and c.owner = 1 and l.favorite = 1 group by l.id;
    `;

    db.all(space, function(err, rows) {
      if (err) {console.log(err)} else
      res.send(rows);
    })
  });

  //SHOW SHARED LISTS
  app.get('/api/lists/shared', function(req, res, next) {
    if(req.session.id == null) {
      res.status(401)
      res.send()
      return
    }
    db.all(`

      select l.*,
      	(select count(i.id) from items i where i.listid = l.id ) as items,
      	(select count(i.id) from items i where i.listid = l.id  and i.done = 1) as done
      from lists l
      inner join collaborators
      where collaborators.userid = '${req.session.id}'
      and collaborators.listid = l.id
      and collaborators.owner = 0
      group by l.id;

      `, function(err, rows) {
      if (err) {
        console.error(err.message);
      } else {
        res.send(rows);
      }
    });
  });

  //GET LIST BY ID
  app.get('/api/lists/:id', function(req, res) {
    id = req.params.id;
    space = "select l.*, (select count(i.id) from items i where i.listid = l.id ) as items,(select count(i.id) from items i where i.listid = l.id  and i.done = 1) as done from lists l WHERE owner ="+req.session.id+" AND l.id = " + id.toString() + " group by l.id;";
    db.each(space, function(err, row) {

      if (err) { console.log(err) }

      // Get collaborators
      if(row.shared == 1) {
        space = `select userid, name, email, owner from collaborators
                  inner join users on users.id = collaborators.userid
                  where collaborators.listid = ${req.params.id}
				          order by owner desc, name asc`

        db.all(space, function(err, users) {
          row.users = users;
          res.send(row);
        });
      } else {
        res.send(row);
      }




    })
  });

  //UPDATE

  app.put('/api/lists/:id', function(req, res) {

    id = req.params.id;

    space = "UPDATE lists SET name=" + "'" + req.body.name + "'" + ", color=" + "'" + req.body.color + "'"+ ", icon=" + "'" + req.body.icon + "'" + "  WHERE owner ="+req.session.id+" AND id =" + (id.toString());
    db.all(space, function(err, rows) {
      if (err) {
        console.log(err)
      };
    })
    space = "SELECT * FROM lists WHERE owner ="+req.session.id+" AND name = " + "'" + req.body.name + "'";
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

space = 'SELECT * FROM items WHERE owner ='+req.session.id+' AND listid='+req.params.listid;
db.all(space,function(err,rows){
  if (err){console.log(err)}
  res.send(rows);
})

});


  //ADD
  app.post('/api/lists', function(req, res) {
    let space = `INSERT INTO lists(name, icon, owner, color ) VALUES (?, ?, ?, ?)`;
    db.run(space, [req.body.name, req.body.icon, req.session.id, req.body.color], function(err) {
      if (err) {
        console.log(err);
      }

      console.log(this.lastID)

      db.run('insert into collaborators (listid, userid, owner) values (?, ?, 1)',
            [this.lastID, req.session.id],
            function(err){ });

    });
    // space = "SELECT * FROM lists WHERE name = " + "'" + req.body.name + "'";
    // db.all(space, function(err, rows) {
    //   if (err) {
    //     console.log(err)
    //   };
    //   res.send(rows);
    // })
    res.send();
  });


  //needed: function that counts a lists items and how many are done
}
