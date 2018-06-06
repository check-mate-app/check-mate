module.exports = function(app,db) {

  // add collaborator to list
  app.post('/api/collaborators', function(req, res) {

    // @todo: check if user is allowed to add collaborator to list
    db.all(`select id from users where name = '${req.body.user}' or email = '${req.body.user}'`, function(err, rows) {

      if(rows !== undefined && rows.length == 1) {

        db.all(`select id from collaborators where userid = ${rows[0].id} and listid = ${req.body.listid} and owner = 0`, function(err, rows2) {

          if(rows2 === undefined || rows2.length == 0) {
            db.run('insert into collaborators (userid, listid, owner) values (?, ?, 0)',
                  [rows[0].id, req.body.listid],
                  function(err){
                    if(err) console.log(err);
                    res.send();
                  });
          } else {
            res.send();
          }
        });

      } else {
        res.status(404);
        res.send({error: "User not found."});
      }

    });



  });

  app.delete('/api/collaborators', function(req, res) {

    // @todo: check if user is allowed to remove collaborator from list
    db.run(`delete from collaborators where listid = ${req.body.listid} and userid = ${req.body.userid}`,
          function(err){
            if(err) console.log(err);
            res.send();
          });
  });


}
