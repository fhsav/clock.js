function Sync(){}
Sync.prototype['get servertime'] = function(socket){
  socket.emit('servertime',new Date());
}

module.exports = Sync;