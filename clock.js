// Node.js core
var fs = require('fs')
  , path = require('path');

// Express
var express = require('express')
  , app = express();

// Express middleware
var bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , multer = require('multer')
  , session = require('express-session')
  , stylus = require('stylus')
  , flash = require('connect-flash');

// Database
var mongoose = require('mongoose')
  , Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo; // Connect GFS and MongoDB

// Miscellaneous utilities
var uuid = require('node-uuid');
var yaml = require('js-yaml');

// Grab settings
var database = yaml.safeLoad(fs.readFileSync(__dirname + '/config/database.yaml', 'utf8'));
database.mongodb_uri = process.env['MONGODB_URI'];

// Include data models
fs.readdirSync(__dirname + '/app/models').forEach(function(file) {
  if (path.extname(file)) require(__dirname + '/app/models/' + file);
});

// Configure Express view engines and middleware
app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');
app.locals.pretty = true;

app.use(stylus.middleware(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));

// Setup view controller
app.use(bodyParser());
app.use(cookieParser());
app.use(session({secret: uuid.v4()}));
app.use(multer());
app.use(flash());

var Clock = require(__dirname + '/app/controllers/clock');
var Admin = require(__dirname + '/app/controllers/admin');
var Wallpaper = require(__dirname + '/app/controllers/wallpaper');

// We're ready!
console.log('Connecting to database...');
mongoose.connect(database.mongodb_uri);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log('Connected!');

  app.use('/', Clock);
  app.use('/admin', Admin);
  app.use('/wallpaper', Wallpaper);

  var port = process.env.PORT || 3000;
  app.listen(port, function() {
    console.log('Listening on port ' + port);
  });
});
