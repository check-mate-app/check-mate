module.exports = function(app,db) {

// add collaborator to list
app.post('/api/collaborators', function(req, res) {

  // @todo: check if user is allowed to add collaborator to list
  db.run('insert into collaborators (listid, userid, owner) values (?, ?, 0)',
        [req.params.userid, req.params.listid],
        function(err){
          if(err) console.log(err);
        });
});


}
