$(function() {
  updateTime();
  createMarquee();
  highlightActivePeriod();
});

function updateTime() {
  $("#date").text( moment().format('dddd, MMMM D, YYYY') );
  $("#time").text( moment().format('h:mm:ss') );
  
  setTimeout(updateTime, 1000);
}

function createMarquee() {
  $("#marquee ul").marquee({ pauseOnHover: false });
}

function highlightActivePeriod() {
  $('#schedule ol li').each(function (index, element) {
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
  
  setTimeout(highlightActivePeriod, 1000);
}
