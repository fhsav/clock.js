onload = function() {
	$("#date").text( moment().format('dddd, MMMM Do, YYYY') );
	$("#time").text( moment().format('h:mm:ss A') );

	setInterval(function() {
		$("#date").text( moment().format('dddd, MMMM Do, YYYY') );
	}, 1000);
	setInterval(function() {
		$("#time").text( moment().format('h:mm:ss A') );
	}, 1000);
};
