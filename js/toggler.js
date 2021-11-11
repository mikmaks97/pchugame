$(document).ready(function() {
  $(".helpInfo").hide();
  $(".aboutInfo").hide();

  var controlToggle = false;
  $('#controlToggle').on('click',function() {
    var controlText = $(this).find("p");
    controlToggle = !controlToggle;
    controlText.toggleClass("colorToggle");
    if (controlToggle) {
      $(".leftControls").animate({opacity: 1});
      $('.rightControls').animate({opacity: 1});
    }
    else {
      $(".leftControls").animate({opacity: 0});
      $('.rightControls').animate({opacity: 0});
    }
  });

  var helpToggle = false;
  $("#helpToggle").on('click',function() {
    var helpText = $(this).find("p");
    helpToggle = !helpToggle;
    helpText.toggleClass("colorToggle");
    $(".helpInfo").fadeToggle("slow");
  });

  var aboutToggle = false;
  $("#aboutToggle").on('click',function() {
    var helpText = $(this).find("p");
    aboutToggle = !aboutToggle;
    helpText.toggleClass("colorToggle");
    $(".aboutInfo").fadeToggle("slow");
  });
});
