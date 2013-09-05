onload = function() {
	
  $("#date").text( moment().format('dddd, MMMM Do, YYYY') );
  //socket.io takes a while to load and connect... to guarantee a "seamless" experience, we'll take the h/m client side time just this once :)
  $("#time").text( moment().format('h:mm A') );
  
  setInterval(function() {
        if(offset){
          var time = moment().add(offset);
          $("#date").text( time.format('dddd, MMMM Do, YYYY') );
          $("#time").text( time.format('h:mm:ss A') );
        }
      }, 1000);
      
  socket = io.connect(document.URL);
  
	socket.on('connect', function () {
    socket.emit('whattime', {});
    
    socket.on('time',function(time){
      offset = moment().subtract('ms',parseInt(time));
    });
	});
};