module.exports = function(app,db){

  //Show all users
  app.get('/api/users',function(req, res){
    db.all(`SELECT * FROM users`, function(err, rows){
      if (err) {
        console.log(err)
      }
        res.send(rows);
    });
  });


  //Show specific user by specifying ID
  app.get('/api/users/:id', function(req, res){
    let id = req.params.id;
    space = `SELECT * FROM users WHERE id =` + (id.toString());
    db.all(space, function(err, rows) {
      if (err) {
        console.log(err)
      }
        res.send(rows);
    });
  });

//Add new user
  app.post('/api/users', function(req, res){
    let space = `INSERT INTO users(name, password, email) VALUES (?, ?, ?)`;
    db.run(space,[req.body.name,req.body.password,req.body.email], function(err){
      if (err) {
        console.log(err)
      }
        res.send([]);
    });
  });



//Delete user by ID
  app.delete('/api/users/:id',function(req,res){
    let id = req.params.id;
    let space = `DELETE FROM users WHERE id =` + (id.toString());
    db.run(space, function(err){
      if (err) {
        console.log(err)
      };
    });
    res.send({})
  });

};
