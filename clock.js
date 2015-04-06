let fs = require('fs')                       // Node.js core
  , path = require('path');

let express = require('express')             // Express
  , app = express();

let server = require('http').Server(app)     // Socket.IO
  , io = require('socket.io')(server);

let bodyParser = require('body-parser')      // Express middleware
  , cookieParser = require('cookie-parser')
  , multer = require('multer')
  , session = require('express-session')
  , stylus = require('stylus')
  , flash = require('flash')
  , morgan = require('morgan');

let mongoose = require('mongoose')           // Datastores
  , Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo; // Connect GFS and MongoDB

let uuid = require('node-uuid');             // Miscellaneous utilities

// Grab settings
let datastore = require(`${__dirname}/config/datastore`);
let mongodb_uri = datastore.mongodb_uri || process.env.MONGODB_URI || 'localhost';

// Include data models
fs.readdirSync(`${__dirname}/app/models`).forEach((file) => {
  if (path.extname(file)) require(`${__dirname}/app/models/${file}`);
});

// Configure Express view engines and middleware
app.set('views', `${__dirname}/app/views`);
app.set('view engine', 'jade');
app.locals.pretty = true;

app.use(stylus.middleware(`${__dirname}/public`));
app.use(express.static(`${__dirname}/public`));
app.use(morgan('dev'));

// Setup view controller
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: uuid.v4(), saveUninitialized: true, resave: true}));
app.use(multer());
app.use(flash());

let Clock = require(`${__dirname}/app/controllers/clock`);
let Admin = require(`${__dirname}/app/controllers/admin`);
let Wallpaper = require(`${__dirname}/app/controllers/wallpaper`);

// Allow controllers to use Socket.IO. If there is a better way to do this, I
// would love to know.
app.locals.io = io;

// We're ready!
console.log('Connecting to MongoDB...');
mongoose.connect(mongodb_uri);

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
  console.log('Connected!');

  app.use('/', Clock);
  app.use('/admin', Admin);
  app.use('/wallpaper', Wallpaper);

  // Setup 404
  app.use((req, res, next) => {
    res.status(404);
    res.render('404');
  });

  let port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
});
