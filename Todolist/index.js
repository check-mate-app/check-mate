const express = require('express');
const app = express();

app.engine('.ejs', require('ejs').__express);
app.set('view engine', 'ejs');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.listen(3000, function(){
	console.log('listening on port 3000');
});

app.get('/', function(req, res){
	res.sendFile(__dirname + '/helloworld.html');
});

//initialize db
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('data.db', (err)=>{
	if (err){
		console.error(err.mesaage);
	}
	console.log('connected to data.db database');
});
