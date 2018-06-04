module.exports = function(app,db) {

  // add collaborator to list
  app.post('/api/collaborators', function(req, res) {

    // @todo: check if user is allowed to add collaborator to list
    db.run('insert into collaborators (userid, listid, owner) values (?, ?, 0)',
          [req.body.userid, req.body.listid],
          function(err){
            if(err) console.log(err);
            res.send();
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
