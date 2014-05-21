function Sync(){}
Sync.prototype['get servertime'] = function(api){
  api.socket.emit('servertime',new Date());
}

module.exports = Sync;