var express = require('express');
var app = express();
var stylus = require('stylus');

var pub = __dirname + '/public';

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.locals.pretty = true;

app.use(stylus.middleware(__dirname + '/public'));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('clock');
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log('Listening on port ' + port);
});