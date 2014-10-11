var fs = require('fs')                       // Node.js core
  , path = require('path');

var express = require('express')             // Express
  , app = express();

var bodyParser = require('body-parser')      // Express middleware
  , cookieParser = require('cookie-parser')
  , multer = require('multer')
  , session = require('express-session')
  , stylus = require('stylus')
  , flash = require('connect-flash')
  , morgan = require('morgan');

var mongoose = require('mongoose')           // Datastores
  , Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo; // Connect GFS and MongoDB

var uuid = require('node-uuid');             // Miscellaneous utilities
var yaml = require('js-yaml');

// Grab settings
var datastore = yaml.load(fs.readFileSync(__dirname + '/config/datastore.yaml', 'utf8'));
var mongodb_uri = datastore.mongodb_uri || process.env.MONGODB_URI || 'localhost';

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
app.use(morgan('dev'));

// Setup view controller
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: uuid.v4(), saveUninitialized: true, resave: true}));
app.use(multer());
app.use(flash());

var Clock = require(__dirname + '/app/controllers/clock');
var Admin = require(__dirname + '/app/controllers/admin');
var Wallpaper = require(__dirname + '/app/controllers/wallpaper');

// We're ready!
console.log('Connecting to MongoDB...');
mongoose.connect(mongodb_uri);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', function() {
  console.log('Connected!');

  app.use('/', Clock);
  app.use('/admin', Admin);
  app.use('/wallpaper', Wallpaper);

  // Setup 404
  app.use(function(req, res, next) {
    res.status(404);
    res.render('404');
  });

  var port = process.env.PORT || 3000;
  app.listen(port, function() {
    console.log('Listening on port ' + port);
  });
});
