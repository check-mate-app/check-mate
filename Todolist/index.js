const express = require('express');
const app = express();

// initialize ejs template engine
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

// set default views folder
app.set('views', __dirname + '/assets/views');

// Directly serve all files in public/
app.use(express.static('public'));

const bodyParser = require('body-parser');
app.use(bodyParser.json());

//initialize db
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('data.db', (err)=>{
	if (err){
		console.error(err.mesaage);
	}
	console.log('connected to data.db database');
});

app.listen(3000, function(){
	console.log('listening on port 3000');
});

//above are initializations only

app.get('/', function(req, res){
	res.render('app');
});


//SHOW LISTS
app.get('/api/lists', function(req, res){
	db.all(`SELECT * FROM lists`,  function(err, rows) {
		if (err) {
			console.error(err.message);
		}else{
			res.send(rows);
		}
	});
});



////DELETE
app.delete('/api/lists/:id',function(req,res){

var id = req.params.id;
id = id.slice(1);
	space = "DELETE from lists WHERE id ="+(id.toString());
	db.run(space, function(err){
		if (err){console.log(err)}
	})
console.log("deleted item with id of: "+ id);
res.send({})
});


//GET LIST BY ID
app.get('/api/lists/:id', function(req, res){
	id = req.params.id;
	id = id.slice(1);
	console.log("ID " + id);

	space = "SELECT * FROM lists WHERE id ="+(id.toString());
	db.all(space,function(err,rows){
		if (err){console.log(err)};
		console.log("log");
		res.send(rows);
		//missing: items on the list are not included in res.send yet
	})
});

//UPDATE

app.put('/api/lists/:id',function(req,res){

	id = req.params.id;
	id = id.slice(1);

	space = "UPDATE lists SET name="+"'"+req.body.name+"'"+" WHERE id ="+(id.toString()) ;
	db.all(space,function(err,rows){
		if (err){console.log(err)};
	})
	space = "SELECT * FROM lists WHERE name = "+"'"+req.body.name+"'";
	db.all(space,function(err,rows){
		if (err){console.log(err)};
		console.log("log");
		res.send(rows);
	})

});


//ADD
app.post('/api/lists', function (req,res){
	console.log(req.body);
	let space = `INSERT INTO lists(name, done, owner) VALUES (?, ?, ?)`;
	db.run(space, [req.body.name, req.body.done, req.body.owner], function(err){
		if
		 (err) {console.log(err);}
	});
	space = "SELECT * FROM lists WHERE name = "+"'"+req.body.name+"'";
	db.all(space,function(err,rows){
		if (err){console.log(err)};
		console.log("log");
		res.send(rows);
	})
});
