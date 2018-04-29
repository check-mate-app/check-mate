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

app.listen(3000, function(){
	console.log('listening on port 3000');
});

app.get('/', function(req, res){
	res.render('app');
});

app.get('/api/lists', function(req, res){
	res.send(sqltoarray())
  //res.send(JSON.stringify(data));
});

//initialize db
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('data.db', (err)=>{
	if (err){
		console.error(err.mesaage);
	}
	console.log('connected to data.db database');
});





function sqltoarray()
{


	db.each(`SELECT * FROM lists`,  (err, row) => {
	if (err) {
	console.error(err.message);
	}
	// row ist ein Objekt mit den Felder als Properties

	const id = row.id;
	const name = row.name;
	const done = row.done;
	const owner = row.owner;
	console.log("ID ", id," NAME: ", name,"  DONE: ",done, "  OWNER: ",owner);
	});

};
