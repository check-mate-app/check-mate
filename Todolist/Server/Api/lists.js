module.exports = function (app, db) {

  //SHOW LISTS
  app.get('/api/lists', function(req, res, next) {
    if(req.session.id == null) {
      res.status(401)
      res.send()
      return
    }
    db.all(`select l.*, (select count(i.id) from items i where i.listid = l.id ) as items,(select count(i.id) from items i where i.listid = l.id  and i.done = 1) as done from lists l WHERE owner =`+req.session.id+` group by l.id;`, function(err, rows) {
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
    id = req.params.id;
    space = "select l.*, (select count(i.id) from items i where i.listid = l.id ) as items,(select count(i.id) from items i where i.listid = l.id  and i.done = 1) as done from lists l WHERE owner ="+req.session.id+" AND l.favorite = 1 group by l.id;";
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
    space = `
    select l.*,
      (select count(i.id) from items i where i.listid = l.id ) as items,
      (select count(i.id) from items i where i.listid = l.id  and i.done = 1) as done,
      case when collaborators.id is not null then 1 else 0 end as shared
    from lists l
    left join collaborators on collaborators.listid = l.id
    where
    (owner = ${req.session.id} or collaborators.userid = ${req.session.id})
    and l.id = ${req.params.id} group by l.id;
    `;
    db.each(space, function(err, row) {
      if (err) {console.log(err)}
      res.send(row);
    })
  });

  //UPDATE

  app.put('/api/lists/:id', function(req, res) {

    id = req.params.id;

    space = "UPDATE lists SET name=" + "'" + req.body.name + "'" + ", color=" + "'" + req.body.color + "'"+ ", icon=" + "'" + req.body.icon + "', favorite='" + req.body.favorite + "' WHERE id =" + (id.toString());
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

space = `
select items.* from items
inner join lists on items.listid = lists.id
left join collaborators on collaborators.listid = lists.id
where items.listid = ${req.params.listid}
and (
lists.owner = ${req.session.id} or
(collaborators.listid = lists.id and collaborators.userid = ${req.session.id})
)
`;
db.all(space,function(err,rows){
  if (err){console.log(err)}
  res.send(rows);
})

});


  //ADD
  app.post('/api/lists', function(req, res) {
    let space = `INSERT INTO lists(name, icon, owner, color, favorite ) VALUES (?, ?, ?, ?, ?)`;
    db.run(space, [req.body.name, req.body.icon, req.session.id, req.body.color, req.body.favorite], function(err) {
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
