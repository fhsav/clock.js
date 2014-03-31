// Node.js Core
var fs = require('fs');

// Express
var express = require('express');
var app = express();

// Express middleware
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var stylus = require('stylus');

// MongoDB
var MongoClient = require('mongodb').MongoClient;
var Grid = require('gridfs-stream');

// Miscellaneous
var uuid = require('node-uuid');
var yaml = require('js-yaml');

// Clock.js classes
var Admin = require(__dirname + '/lib/admin');
var Themes = require(__dirname + '/lib/themes');
var Schedules = require(__dirname + '/lib/schedules');
var Marquee = require(__dirname + '/lib/marquee');
var Notices = require(__dirname + '/lib/notices');
var Periods = require(__dirname + '/lib/periods');

// Clock.js route classes
var clockRoute = require(__dirname + '/routes/clock');
var adminRoute = require(__dirname + '/routes/admin');
var themesRoute = require(__dirname + '/routes/themes');
var schedulesRoute = require(__dirname + '/routes/schedules');
var marqueeRoute = require(__dirname + '/routes/marquee');
var noticesRoute = require(__dirname + '/routes/notices');

var database = yaml.safeLoad(fs.readFileSync(__dirname + '/config/database.yaml', 'utf8'));
database.mongodb_uri = process.env['MONGODB_URI'];

Admin.setVersion('0.1.0');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.locals.pretty = true;

app.use(stylus.middleware(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));

app.use(cookieParser());
app.use(session({secret: uuid.v4()}));

app.use(bodyParser());

// The binding - .bind() - here is necessary since only the
// function is being passed, without its scope.
//
// http://stackoverflow.com/questions/15604848/express-js-this-undefined-after-routing-with-app-get

clockRoute.setRoutes(app);
adminRoute.setRoutes(app);
themesRoute.setRoutes(app);
schedulesRoute.setRoutes(app);
marqueeRoute.setRoutes(app);
noticesRoute.setRoutes(app);

console.log('Connecting to MongoDB...');

MongoClient.connect(database.mongodb_uri, function(err, db) {
  if (err) throw err;

  console.log('Connected!');

  Themes.setMongoDB(db);
  Schedules.setMongoDB(db);
  Marquee.setMongoDB(db);
  Notices.setMongoDB(db);
  Periods.setMongoDB(db);

  var modules = {
    'Admin': Admin,
    'Themes': Themes,
    'Schedules': Schedules,
    'Marquee': Marquee,
    'Notices': Notices,
    'Periods': Periods
  };

  clockRoute.setModules(modules);
  adminRoute.setModules(modules);
  themesRoute.setModules(modules);
  schedulesRoute.setModules(modules);
  marqueeRoute.setModules(modules);
  noticesRoute.setModules(modules);

  var port = process.env.PORT || 3000;
  app.listen(port, function() {
    console.log('Listening on port ' + port);
  });
});
