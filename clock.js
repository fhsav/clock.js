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

app.listen(3000);
console.log('Listening on port 3000');