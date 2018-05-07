module.exports = function(app,db){

    app.post('/api/users', function(req, res) {
      let space = `INSERT INTO users(name, password, email) VALUES (?, ?,?)`;
      db.run(space,[req.body.name,req.body.password,req.body.email], function(err){
        if (err) {console.log(err)}

res.send([]);

      });
    });


//show all users

app.get('/api/users',function(req, res){
  db.all(`SELECT * FROM users`, function(err, rows){
    if (err) {console.log(err);}

    res.send(rows);
  });

});

//get user by ID
app.get('/api/users/:id', function(req, res) {
  id = req.params.id;
  space = "SELECT * FROM users WHERE id =" + (id.toString());
  db.all(space, function(err, rows) {
    if (err) {
      console.log(err)
    };
    res.send(rows);

  })
});







}
