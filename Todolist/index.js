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
	res.set('Content-Type', 'JSON');
	res.send(new Buffer(sqltoarray()));
	console.log(sqltoarray());
});



//initialize db
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('data.db', (err)=>{
	if (err){
		console.error(err.mesaage);
	}
	console.log('connected to data.db database');
});




//FOLLOWING FUNCTION READS THE DATA.DB TABLE CALLED lists
// IT GETS ALL ROW-ELEMENTS BUT RETURNING THEM DOESNT WORK YES 

// function sqltoarray()
// {
// 	let id = 0;
// 	let name = ' ';
// 	let done = 0;
// 	let owner = ' ';
//
// 	var toStringify = [];
//
// 	db.each(`SELECT * FROM lists`,  (err, row) => {
// 		if (err) {
// 			console.error(err.message);
// 		}
// 		// row ist ein Objekt mit den Feldern als Properties
//
// 	 	id = row.id;
// 	 	name = row.name;
// 	 	done = row.done;
// 	 	owner = row.owner;
//
// 		toStringify = ["pushed"];
// 		console.log(toStringify);
//
// 	//je obj ein neuer {} im JSON string
// 	//toStringify = toStringify.push();
//
// });
//
// 		return(JSON.stringify(toStringify));
//
// };
