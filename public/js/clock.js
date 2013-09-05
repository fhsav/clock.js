var socket;
getOffset = function() {
		socket.emit('whattime', {});
		return socket.on('time',function(time){
			return moment().subtract('ms',parseInt(time));
		};
		
	}

onload = function() {
	var offset;
	socket = io.connect('http://localhost:3000');
	socket.on('connect', function () {
		offset = getOffset();
	});
	setInterval(function() {
		if(offset){
			var time = moment().subtract(offset);
			$("#date").text( time.format('dddd, MMMM Do, YYYY') );
			$("#time").text( time.format('h:mm:ss A') );
		}
	}, 1000);
};