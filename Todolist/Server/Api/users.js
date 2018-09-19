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
    if (req.session.id && req.session.id !== undefined) {
      //change all sessionvars to null
      console.log('logging out...')
      req.session.reset()
      res.send()
    }
    else{res.status(401);
         res.send();}
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

    //Add new demo user   sign up and login! (demo)
    app.post('/api/demo', function(req, res) {

      let pw = passwordHash.generate("password");
      let query = `INSERT INTO users (name, password, email) VALUES (?, ?, ?)`;

      console.log(req.body.name);

      let tempmail = req.body.name.replace(/ /g,'').toLowerCase() + "@check-mate.app";

      db.run(query,[req.body.name,pw,tempmail], function(err) {
        if (err) {
          console.log(err)
          res.status(409)
          res.send({error: "Username already taken. Try another one!"});
        } else {

          // Create a demo shopping list (as favorite)
          
          req.session.id = this.lastID;

          let space = `INSERT INTO lists (name, icon, color, favorite ) VALUES (?, ?, ?, ?)`;
          db.run(space, ["Shopping List", "mdi:cart", 7, 1], function(err) {
            if (err) {
              console.log(err);
            }

            let demolist = this.lastID;

            // mark as owner
            db.run('insert into collaborators (listid, userid, owner) values (?, ?, 1)',
                  [demolist, req.session.id],
                  function(err){ });

            // add some entries
            let space = `INSERT INTO items(listid, content, done) VALUES
              (${demolist}, 'Soda', 1),
              (${demolist}, 'Bananas', 0),
              (${demolist}, 'Apples', 0),
              (${demolist}, 'Bread', 0),
              (${demolist}, 'Margarine', 0),
              (${demolist}, 'Chives', 1),
              (${demolist}, 'Onions', 0),
              (${demolist}, 'Chips', 0),
              (${demolist}, 'Coke', 0),
              (${demolist}, 'Toilet Paper', 0),
              (${demolist}, 'Soap', 0),
              (${demolist}, 'Toothbrush', 0),
              (${demolist}, 'Paper', 0),
              (${demolist}, 'Ink', 0),
              (${demolist}, 'Noodles', 0),
              (${demolist}, 'Cookies', 0),
              (${demolist}, 'Corn', 1)
            `;
            db.run(space, function(err, row) {
              if (err) {
                console.log(err)
              }
            });
        
          // /end demo shopping list
          res.send({id: req.session.id});
        });
      }
      
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

    if(id == "me") {
      id = req.session.id;
    }

    console.log(id);
    query = `SELECT id, name, email FROM users WHERE id =` + (id.toString());
    db.all(query, function(err, rows) {
      if (err) { console.log(err) }
        res.send(rows[0]);
    });
  });


//EVTL SESSION VAR GESCHÜTZT
// für delete und update
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
