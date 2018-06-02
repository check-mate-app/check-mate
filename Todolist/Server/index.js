// CONFIG
const DEVELOPMENT = true;
// AUTO-GENERATED CONFIG
const STATIC_FOLDER = DEVELOPMENT ? __dirname + '/../WebClient/' : __dirname + '/../WebClient/build/es5-bundled/';
const INDEX_HTML = DEVELOPMENT ? __dirname + '/../WebClient/index.html' : __dirname + '/../WebClient/build/es5-bundled/index.html';
// END CONFIG
 const passwordHash = require('password-hash');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();

const session = require('client-sessions');
app.use(session({
  secret: 'quatrocoptolopis',
  cookieName: 'session',
  duration: 86400,
  activeDuration: 1000*60*5
}));





// Directly serve all files in public/
app.use(express.static(path.resolve(STATIC_FOLDER)));
app.use(bodyParser.json());

// initialize db
const db = new sqlite3.Database(__dirname + '/Database/data.db', (err)=>{
	if (err){
		console.error(err.mesaage);
	}
	console.log('connected to data.db database');
});

app.listen(3000, function(){
	if(DEVELOPMENT) console.warn('⚠ running server in development mode. do not use this for production.');
	console.log('listening on port 3000');
});

// import api
require('./Api/_api.js')(app, db);

app.get('*', function(req, res){
	res.sendFile(path.resolve(INDEX_HTML));
});
