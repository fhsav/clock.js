//Inclusions
var ntpClient = require('ntp-client')
, moment = require('moment');

//Object declaration
function Sync(){}

/* Properties:
 * To read a property from the config file, you have to define a key and its default value here
 * If it does not already exist in the config file, it will be created
 */
Sync.prototype.properties = {
  timezone:-5 //GMT-5 is Eastern Time
}
/* Tickable functions:
 * These are Objects where `function` is a function to be executed every `ms` milliseconds,
 * and if `start` is true, it happens once when the application starts
 */
Sync.prototype.tick = {};
Sync.prototype.tick["get NTP time"] = {
  function:function(api){
    var me = this;
    console.log("Grabbing the time offset...");
    ntpClient.getNetworkTime("pool.ntp.org", 123, function(err, date) {
      if (err) return console.error(err);
      date = moment(date).zone(me.properties.timezone);
      me.offset = moment().zone(me.properties.timezone).subtract(date);
      console.log("Offset is "+date.fromNow(true)+" from this computer's clock.");
      me['get servertime'](api); //refresh everyone by triggering the event as global socket
    });
  },ms:15 * 1000*60 //every (15 minutes to ms)
  , onStart:true
};

/* Volatile properties:
 * Put your own changeable properties here, but make sure they're in the prototype
 */
Sync.prototype.offset = null;

/* Events:
 * These are any function stored directly into the prototype.
 * Whatever their name is will be the client socket event that triggers them
 */
Sync.prototype['get servertime'] = function(api){
  if (this.offset){
    api.socket.emit('servertime',moment().add(this.offset));
  }
}

//Export
module.exports = Sync;