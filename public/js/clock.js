var time;
var socket;
$(function() {
  socket = io.connect();
  socket.on('servertime',function(servertime){
    if(moment(servertime).isValid())
      time = moment(servertime).subtract(new Date());
  });
  updateTime();
  createMarquee();
  highlightActivePeriod();
});

function updateTime() {
  $("#date").text( moment().format('dddd, MMMM D, YYYY') );
  $("#time").text( moment().format('h:mm') );

  setInterval(function() {
    $("#date").text( moment().format('dddd, MMMM D, YYYY') );
  }, 1000);
  
  setInterval(function() {
    if(time)
      $("#time").text( moment().add(time).format('h:mm:ss') );
    else
      socket.emit('get servertime');
  }, 1000);
}

function createMarquee() {
  $("#marquee ul").marquee({ pauseOnHover: false });
}

function highlightActivePeriod() {
  setInterval(function() {
    $('#schedule ol li') .each(function (index, element) {
      var startTime = $($(element).children()[0]).attr('datetime');
      var finishTime = $($(element).children()[1]).attr('datetime');

      var startTimeX = moment(startTime, "HH:mm:ss").format('X');
      var finishTimeX = moment(finishTime, "HH:mm:ss").format('X');

      var now = moment().format('X');

      if (startTimeX < now && now < finishTimeX) {
        $(element).addClass('active');
      } else {
        $(element).removeClass('active');
      }
    });
  }, 1000);
}