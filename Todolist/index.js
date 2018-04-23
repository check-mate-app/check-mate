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
