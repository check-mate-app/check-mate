module.exports = function(app,db){

  //SHOW ALL items
  app.get('/api/items/',function(req,res){
    db.all(`SELECT * FROM items`, function(err, rows) {
      if (err) {
        console.error(err.message);
      } else {
        res.send(rows);
      }
    });
  });

  //ADD item

  // must be called with:
  // {
  // "content": "Die ToDo-Liste von Weitz",
  // "listID": 8,
  // "done": 0,
  // }

  app.post('/api/items', function(req, res) {
    console.log(req.body.listID);
    let listID = req.body.listID;
    let space = `INSERT INTO items(content, done) VALUES (?, ?)`;
    db.run(space, [req.body.content, req.body.done], function(err) {
      if (err) {
        console.log(err);
        //res.send ROWS ID an db.run unten für item id
      }

      })
      let itemID  = getItemID();

    space = 'INSERT INTO item_list_relation( list_id, item_id) VALUES(?, ?)';
    //item id kann über function in cosole gegeben werden, aber nicht in var gespeichert
    db.run(space, [listID,itemID], function(err){
      if(err){console.log(err)}
        console.log("ILR REQ BODY ID "+listID);
        console.log("function "+ getItemID());

        //ausgabe
    // space = "SELECT * FROM lists WHERE name = " + "'" + req.body.name + "'";
    // db.all(space, function(err, rows) {
    //   if (err) {
    //     console.log(err)
    //   };
    //   console.log("log");
    //   res.send(rows);
    // })
  });
  });





function getItemID(){
  let ext = 0;
  space =  'SELECT * FROM items WHERE id IN (select max(id) from items)';
   db.each(space, function(err,row){
    if (err){
      console.log(err)
    }
    ext = row.id;
    return(ext);
    console.log("ext  "+ext);
})
}

}
