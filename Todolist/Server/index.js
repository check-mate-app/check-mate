const express = require('express');
const app = express();

// initialize ejs template engine
app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

// set default views folder
app.set('views', __dirname + '/../WebClient/assets/views');

// Directly serve all files in public/
app.use(express.static(__dirname + '/../WebClient/public'));

const bodyParser = require('body-parser');
app.use(bodyParser.json());

//initialize db
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(__dirname + '/Database/data.db', (err)=>{
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

// import api
require('./Api/_api.js')(app, db);
