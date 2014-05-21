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
  , stylus = require('stylus');

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
fs.readdirSync(__dirname + '/models').forEach(function(file) {
  if (path.extname(file)) require(__dirname + '/models/' + file);
});

// Configure Express view engines and middleware
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.locals.pretty = true;

app.use(stylus.middleware(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));

// Set up Socket.io communication

var server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
io.set('browser client gzip',true); //enable compression on socket.io.js

// Enable server-side socket plugins
//glue function to add socket object to every function
Function.prototype.callWith = function(self,argsCallingWith){
  var a = Array.prototype.slice.call(arguments,1)
    , self = arguments[0]
    , f = this;
  return function(){
    var b = Array.prototype.slice.call(arguments)
      , args = a.concat(b);
    return f.apply(self,args);
  }
}

// Setup view controller
app.use(cookieParser());
app.use(session({secret: uuid.v4()}));
app.use(bodyParser());
app.use(multer());

var Clock = require(__dirname + '/controllers/clock');
var Admin = require(__dirname + '/controllers/admin');
var Wallpaper = require(__dirname + '/controllers/wallpaper');

// We're ready!
console.log('Connecting to database...');
mongoose.connect(database.mongodb_uri);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log('Connected!');
  
  //iterate through all .js files in ./api and add the functions to on connection
  fs.readdirSync('./api/').forEach(function(file) {
    if(path.extname(file)==='.js'){
      console.log('[Socket Plugins] Loading "'+file+'"');
      var obj = new(require('./api/'+file));
      for(var key in obj){
        if(typeof obj[key] == 'function'){
          console.log('- loaded function "'+key+'"');
          io.sockets.on('connection',function(socket){
            socket.on(key,obj[key].callWith({
              db:db,
              socket:socket
            },socket));
          });
        }
      }
    }
  });

  app.use('/', Clock);
  app.use('/admin', Admin);
  app.use('/wallpaper', Wallpaper);

  var port = process.env.PORT || 3000;
  server.listen(port, function() {
    console.log('Listening on port ' + port);
  });
});
