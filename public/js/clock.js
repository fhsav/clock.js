$(function() {
  updateTime();
  createMarquee();
  highlightActivePeriod();
  closingTime();
  slideDown();
  passingTime();
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

function slideDown() {
  $('#schedule ol li').each(function(index, element) {
    var finishTime = $($(element).children()[1]).attr('datetime');
    var finishTimeX = moment(finishTime, "HH:mm:ss").format('X');

    var now = moment().format('X');

    if (now >= finishTimeX && $('#schedule ol li').size() > 10) {
      $(element).filter(':visible').slideUp('slow');
    } else {
      $(element).show();
    }
  });

  setTimeout(slideDown, 1000);
}

function passingTime() {
  var lastFinishX;
  
  $('#schedule ol li').each(function(index, element) {
    var startTime = $($(element).children()[0]).attr('datetime');
    var startTimeX = moment(startTime, "HH:mm:ss").format('X');

    var now = moment().format('X');

    if (lastFinishX < now && now < startTimeX) {
      $(element).addClass('next');
    } else {
      $(element).removeClass('next');
    }

    var lastFinish = $($(element).children()[1]).attr('datetime');
    lastFinishX = moment(lastFinish, "HH:mm:ss").format('X');
  });

  setTimeout(passingTime, 1000);
}
