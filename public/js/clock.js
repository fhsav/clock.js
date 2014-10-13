$(function() {
  // Create Marquee
  $('#marquee ul').marquee({pauseOnHover: false});

  function updateClock() {
    // Update time and date
    $("#date").text( moment().format('dddd, MMMM D, YYYY') );
    $("#time").text( moment().format('h:mm:ss') );

    var lastFinishX;
    var scheduleFinished = true;

    $('#schedule ol li').each(function(index, element) {
      var startTime = $($(element).children()[0]).attr('datetime');
      var finishTime = $($(element).children()[1]).attr('datetime');

      var startTimeX = moment(startTime, "HH:mm:ss").format('X');
      var finishTimeX = moment(finishTime, "HH:mm:ss").format('X');

      var now = moment().format('X');

      // Highlight the current period
      if (startTimeX <= now && now < finishTimeX) {
        $(element).addClass('active');
      } else {
        $(element).removeClass('active');
      }

      // See if any periods have time left, otherwise it's closing time
      if (now < finishTimeX) {
        scheduleFinished = false;
      }

      // If our schedule is too big, collapse periods
      if ($('#schedule ol li').size() > 10) {
        $('#schedule').addClass('collapsing');
      } else {
        $('#schedule').removeClass('collapsing');
      }

      if (finishTimeX <= now && $('#schedule ol li').size() > 10) {
        $(element).filter(':visible').slideUp('slow');
      } else {
        $(element).show();
      }

      // Show a marker if we're in between periods
      if (lastFinishX <= now && now < startTimeX) {
        $(element).addClass('next');
      } else {
        $(element).removeClass('next');
      }

      var lastFinish = $($(element).children()[1]).attr('datetime');
      lastFinishX = moment(lastFinish, "HH:mm:ss").format('X');
    });

    // Check if schedule has finished
    if (scheduleFinished) {
      $('#wrapper').addClass('closingTime');
    } else {
      $('#wrapper').removeClass('closingTime');
    }

    setTimeout(updateClock, 1000);
  }

  updateClock();

  var socket = io();

  socket.on('refresh', function() {
    location.reload(true);
  });

  socket.on('error', function() {
    $('#connection-error').show();
  });

  socket.on('disconnect', function() {
    $('#connection-error').show();
  });

  socket.on('reconnect', function() {
    $('#connection-error').hide();
  });
});
