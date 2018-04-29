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
app.use(bodyParser.urlencoded({extended: true}));

//initialize db
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('data.db', (err)=>{
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



app.get('/api/lists', function(req, res){
	res.set('Content-Type', 'JSON');
	res.send(new Buffer(sqltoarray()));
	console.log(sqltoarray());
});


app.post('/api/lists', function (req,res,incomingList){
	//variable could need to be parsed by JSON.parse(var) when softcoded
	 incomingList ={
		"id": 42,
  "name": "Die Ultimative ToDo-Liste von Edi",
  "owner": "xxxfrunobulaxedixxx",
  "done": 0
	};

	let space = `INSERT INTO lists(name, done, owner) VALUES (?, ?, ?)`;
	db.run(space, [incomingList.name, incomingList.done, incomingList.owner], function(err){
		console.log(err);
	});
	res.send();
});


//FOLLOWING FUNCTION READS THE DATA.DB TABLE CALLED lists
//IT GETS ALL ROW-ELEMENTS BUT RETURNING THEM DOESNT WORK YES

function sqltoarray(){
	let insert = "[]";
	db.each(`SELECT * FROM lists`,  (err, row) => {
		if (err) {
			console.error(err.message);
		}
		// row ist ein Objekt mit den Feldern als Properties

	 let id = row.id;
	 let name = row.name;
	 let done = row.done;
	 let owner = row.owner;
	});
	return insert;
};
