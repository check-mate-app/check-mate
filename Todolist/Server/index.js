const express = require('express');
const app = express();

// Directly serve all files in public/
app.use(express.static(__dirname + '/../WebClient/build/es5-bundled/'));

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

app.use('*', function(req, res){
	res.send(__dirname + '/../WebClient/build/es5-bundled/index.html');
});

// import api
require('./Api/_api.js')(app, db);
