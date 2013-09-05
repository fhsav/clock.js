onload = function() {
	socket = io.connect('http://localhost:3001');
  
	socket.on('connect', function () {
    socket.emit('whattime', {});
    
    socket.on('time',function(time){
      offset = moment().subtract('ms',parseInt(time));
      setInterval(function() {
        if(offset){
          var time = moment().subtract(offset);
          $("#date").text( time.format('dddd, MMMM Do, YYYY') );
          $("#time").text( time.format('h:mm:ss A') );
        }
      }, 1000);
      
    });
	});
};