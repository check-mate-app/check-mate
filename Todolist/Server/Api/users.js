module.exports = function(app,db){

 const passwordHash = require('password-hash');

 //login
 app.post('/api/login', function(req, res, next){
   req.session.id = "test";
   req.session.save();
   console.log(req.session.id);

    let pw = req.body.password;
    let name = req.body.name;

    space = 'SELECT password,id FROM users WHERE name ="'+name+'"';
    db.each(space,function(err,row){
      if (err){console.log(err)}
      let id = row.id;
      console.log(passwordHash.verify(pw, row.password));
      if(passwordHash.verify(pw, row.password)){

          // var sessData = req.session;


          res.send({name: name});

      }
      else{
        res.status(401);
        res.send({});
      }
    })
  });

  //logout
  app.get('api/logout',function(req,res){
    //change all sessionvars to null
    delete req.session.id;
  });

  //Show all users
  app.get('/api/users',function(req, res){
    db.all(`SELECT * FROM users`, function(err, rows){
      if (err) {console.log(err)}
        res.send(rows);
    });
  });

  //Show specific user by specifying ID
  app.get('/api/users/:id', function(req, res){
    let id = req.params.id;
    space = `SELECT * FROM users WHERE id =` + (id.toString());
    db.all(space, function(err, rows) {
      if (err) {console.log(err)}
        res.send(rows);
    });
  });

//Add new user   sign up
  app.post('/api/users', function(req, res){
    let pw = passwordHash.generate(req.body.password);
    let space = `INSERT INTO users (name, password, email) VALUES (?, ?, ?)`;
    db.run(space,[req.body.name,pw,req.body.email], function(err){
      if (err) {console.log(err)}
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
