var express = require('express');
var app = express();
var stylus = require('stylus');
var format = require('util').format;
var uuid = require('node-uuid');
require('js-yaml');

var MongoClient = require('mongodb').MongoClient;
var Grid = require('gridfs-stream');

var Admin = require(__dirname + '/lib/admin');
var Themes = require(__dirname + '/lib/themes');
var Schedules = require(__dirname + '/lib/schedules');
var Marquee = require(__dirname + '/lib/marquee');
var Notices = require(__dirname + '/lib/notices');
var Periods = require(__dirname + '/lib/periods');

var route = {};
route.clock = require(__dirname + '/routes/clock');
route.admin = require(__dirname + '/routes/admin');
route.themes = require(__dirname + '/routes/themes');
route.schedules = require(__dirname + '/routes/schedules');
route.marquee = require(__dirname + '/routes/marquee');
route.notices = require(__dirname + '/routes/notices');

var database = require(__dirname + '/config/database.yaml');
database.mongodb_uri = process.env['MONGOHQ_URL'];

Admin.setVersion('0.1.0');

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.locals.pretty = true;

app.use(stylus.middleware(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));

app.use(express.cookieParser());
app.use(express.session({secret: uuid.v4()}));

app.use(express.bodyParser());

// The binding - .bind() - here is necessary since only the
// function is being passed, without its scope.
//
// http://stackoverflow.com/questions/15604848/express-js-this-undefined-after-routing-with-app-get

app.get('/', route.clock.index.bind(route.clock) );

app.get('/admin', route.admin.welcome.bind(route.admin) );
app.get('/admin/themes', route.themes.landing.bind(route.themes) );
app.get('/admin/schedules', route.schedules.landing.bind(route.schedules) );
app.get('/admin/marquee', route.marquee.landing.bind(route.marquee) );
app.get('/admin/notices', route.notices.landing.bind(route.notices) );
app.get('/admin/logout', route.admin.logout.bind(route.admin) );
app.post('/admin/login', route.admin.login_post.bind(route.admin) );

app.get('/schedules/:objectID/edit', route.schedules.edit.bind(route.schedules) );
app.post('/schedules/:objectID/edit', route.schedules.edit_post.bind(route.schedules) );
app.get('/schedules/:scheduleID/periods/:periodID/edit', route.schedules.editPeriod.bind(route.schedules) );
app.post('/schedules/:scheduleID/periods/:periodID/edit', route.schedules.editPeriod_post.bind(route.schedules) );
app.get('/marquees/:objectID/edit', route.marquee.edit.bind(route.marquee) );
app.post('/marquees/:objectID/edit', route.marquee.edit_post.bind(route.marquee) );

app.get('/themes/:objectID/activate', route.themes.activate.bind(route.themes) );
app.get('/schedules/:objectID/activate', route.schedules.activate.bind(route.schedules) );

app.post('/schedules/:objectID/periods/create', route.schedules.createPeriod.bind(route.schedules) );
app.post('/schedules/create', route.schedules.create.bind(route.schedules) );

app.get('/schedules/:objectID/delete', route.schedules.remove.bind(route.schedules) );
app.get('/schedules/:scheduleID/periods/:periodID/delete', route.schedules.deletePeriod.bind(route.schedules) );

app.get('/themes/:objectID/preview', route.themes.preview.bind(route.themes) );
app.get('/themes/wallpaper/active', route.themes.wallpaperActive.bind(route.themes) );
app.get('/themes/wallpaper/:objectID', route.themes.wallpaper.bind(route.themes) );

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

  route.clock.setModules(modules);
  route.admin.setModules(modules);
  route.themes.setModules(modules);
  route.schedules.setModules(modules);
  route.marquee.setModules(modules);
  route.notices.setModules(modules);

  var port = process.env.PORT || 3000;
  app.listen(port, function() {
    console.log('Listening on port ' + port);
  });
});