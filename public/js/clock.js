$(function() {
  updateTime();
  createMarquee();
  highlightActivePeriod();
  closingTime();
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
  $('#schedule ol li').each(function(index, element) {
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

function closingTime() {
  var leaving = true;

  $('#schedule ol li time').each(function(index, element) {
    var finishTime = $(element).attr('datetime');
    var finishTimeX = moment(finishTime, "HH:mm:ss").format('X');

    var now = moment().format('X');

    if (now < finishTimeX) {
      leaving = false;
    }
  });

  if (leaving == true) {
    $('#wrapper').addClass('closingTime');
  } else {
    $('#wrapper').removeClass('closingTime');
  }

  setTimeout(closingTime, 1000);
}
