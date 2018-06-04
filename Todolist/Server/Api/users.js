module.exports = function(app,db){

 const passwordHash = require('password-hash');

 //login
 app.post('/api/login', function(req, res, next){
   if (req.session.id && req.session.id !== undefined) {
    console.log("User already logged in.");
    res.send();
    } else {

     query = 'SELECT id, password FROM users WHERE name ="'+req.body.name+'"';
     db.all(query, function(err, rows) {

       // Return Server Error if something is wrong
       if (err || rows.length > 1) {
         res.status(500);
         res.send({ error: err });
         return
       }

       // Return Unauthorized if user does not exist
       // or password is wrong
       if(rows === undefined || rows.length == 0 ||
          !passwordHash.verify(req.body.password, rows[0].password)) {
         res.status(401);
         res.send({error: "Username or password wrong."});
         return
       } else {
         req.session.id = rows[0].id;
         res.send({id: req.session.id});
       }


     })

     }
  });

  //logout
  app.post('/api/logout',function(req,res){
    //change all sessionvars to null
    console.log('logging out...')
    req.session.reset()
    res.send()
  });


  //Add new user   sign up
  app.post('/api/register', function(req, res) {

    let pw = passwordHash.generate(req.body.password);
    let query = `INSERT INTO users (name, password, email) VALUES (?, ?, ?)`;
    db.run(query,[req.body.name,pw,req.body.email], function(err){
      if (err) {
        console.log(err)
        res.status(409)
        res.send({error: err});
      } else res.send();
    });
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
    query = `SELECT * FROM users WHERE id =` + (id.toString());
    db.all(query, function(err, rows) {
      if (err) {console.log(err)}
        res.send(rows);
    });
  });



//Delete user by ID
  app.delete('/api/users/:id',function(req,res){
     id = req.params.id;
     query = `DELETE FROM users WHERE id =` + (id.toString());
    db.run(query, function(err){
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

    query = `UPDATE users SET name =` + "'" + name + "'" + `, password =` + "'" + password + "'" + `, email =` + "'" + email + "'" + `WHERE id =` + (id.toString());
    db.all(query, function(err, rows) {
      if (err) {
        console.log(err)
      }
    });
    query = "SELECT * FROM users WHERE id = " + "'" + req.params.id + "'";
    db.all(query, function(err, rows) {
      if (err) {
        console.log(err)
      }
      res.send(rows);
    });
  });
};
