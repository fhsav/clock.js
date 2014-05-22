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
function loadPlugins(db){ //Consider: extracting "__dirname+'/api/'" to argument?
  var properties
  , storeback
  , confloc = __dirname+'/api/config.json';
  
  function APIObject(socket){this.socket = socket||this.socket};
  APIObject.prototype = {
    db:db
    , socket:io.sockets //kinda hackish... API abuse likely, should fix later
    //by fix I mean wrap because holy hack this makes tickable refresh code cool
  }
  try{
    properties = JSON.parse(fs.readFileSync(confloc));
  } catch (e) {
    console.error(e);
    properties = {};
    if(!fs.existsSync(confloc)) //if we failed because the file wasn't there, not because it was invalid:
      fs.writeFile(confloc,""); //make the file
  }
  storeback = properties;
  //iterate through all .js files in ./api and add the functions to on connection
  var events = []; //you'll see
  fs.readdirSync(__dirname+'/api/').forEach(function(file) {
    if(path.extname(file)==='.js'){
      console.log('[Socket Plugins] Loading "'+file+'"');
      var obj = new(require(__dirname+'/api/'+file));
      //set up properties
      if(!properties[file])
        properties[file] = {};
      for(var key in obj.properties) //copy the properties if they don't already exist
        if(!properties[file][key]){
          console.log('+ new default key "'+key+'"');
          if(!storeback[file])
            storeback[file] = {};
          properties[file][key] = storeback[file][key] = obj.properties[key];
        }
      
      obj.properties = {}; //protect against silly programmers
      for(var key in properties[file])
        obj.properties[key] = properties[file][key]; //copy only properties we know about
      
      //load events

      for(var key in obj){
        if(typeof obj[key] == 'function'){
          console.log('- loading event "'+key+'"');
          events.push({ //store event for later
            eventname:key,
            function:obj[key],
            thisobj:obj
          });
        }
      }
      
      //load tickables
      for(var key in obj.tick){
        console.log('- loading tickable "'+key+'"');
        var fn = obj.tick[key].function.callWith(obj,new APIObject()); //no socket means global socket
        setInterval(fn,obj.tick[key].ms);
        if(obj.tick[key].onStart)
          setTimeout(fn,0);
      }
      
    }
  });
  io.sockets.on('connection',function(socket){ //actually set up events to be run, by creating a single function
    //will this drive the GC crazy? probably, yeah. thanks socket.io
    for(var key in events){
      var event = events[key]; //I give up ugh
      socket.on(event.eventname,event.function.callWith(event.thisobj,new APIObject(socket))); //seriously, instantiation on every connection; you'd think we'd pool them or something
    }
  });
  fs.writeFile(confloc,JSON.stringify(storeback)); //store back the storeback (defaults), man 
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
  
  loadPlugins(db);

  app.use('/', Clock);
  app.use('/admin', Admin);
  app.use('/wallpaper', Wallpaper);

  var port = process.env.PORT || 3000;
  server.listen(port, function() {
    console.log('Listening on port ' + port);
  });
});
