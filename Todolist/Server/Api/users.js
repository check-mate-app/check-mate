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
    let space = `INSERT INTO users (name, password, email) VALUES (?, ?, ?)`;
    db.run(space,[req.body.name,req.body.password,req.body.email], function(err){
      if (err) {
        console.log(err)
      }
        res.send([]);
    });
  });


//Delete user by ID
  app.delete('/api/users/:id',function(req,res){
     id = req.params.id;
     space = `DELETE FROM users WHERE id =` + (id.toString());
    db.run(space, function(err){
      if (err) {
        console.log(err)
      };
    });
    res.send({});
  });


  //Update user by ID
  app.put('/api/users/:id', function(req, res) {

    id = req.params.id;
    let name = req.body.name;
    let password = req.body.password;
    let email = req.body.email;

    space = `UPDATE users SET name =` + "'" + name + "'" + `, password =` + "'" + password + "'" + `, email =` + "'" + email + "'" + `WHERE id =` + (id.toString());
    db.all(space, function(err, rows) {
      if (err) {
        console.log(err)
      }
    });
    space = "SELECT * FROM users WHERE id = " + "'" + req.params.id + "'";
    db.all(space, function(err, rows) {
      if (err) {
        console.log(err)
      }
      res.send(rows);
    });

  });
};
