$(function() {
  updateTime();
  createMarquee();
  highlightActivePeriod();
});

function updateTime() {
  $("#date").text( moment().format('dddd, MMMM D, YYYY') );
  $("#time").text( moment().format('h:mm:ss') );

  setInterval(function() {
    $("#date").text( moment().format('dddd, MMMM D, YYYY') );
  }, 1000);

  setInterval(function() {
    $("#time").text( moment().format('h:mm:ss') );
  }, 1000);
}

function createMarquee() {
  $("#marquee ul").marquee({ pauseOnHover: false });
}

function highlightActivePeriod() {
  
}