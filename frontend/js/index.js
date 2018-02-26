$(document).ready(function () {
  $(window).resize(function () {
    let height = $("#rightcontent").height();
    $("#resultcontent").css("height", height-110);
  });
  $(document).ready(function(ev){
    let height = $("#rightcontent").height();
    console.log(height);
    $("#resultcontent").css("height", height-110);
  });

  $("#left").mousedown(function (e) {
    $(document).bind("mousemove", function (ev) {
      if (ev.pageX >= 200 && ev.pageX <= 500) {
        $("#left").css("flex-basis", ev.pageX);
      }
    });
  });
  $(document).mouseup(function () {
    $(this).unbind("mousemove");
  });
  $("#enviornment").mousedown(function (e) {
    let x = e.pageX;
    let y = e.pageY;
    let width = $('#enviornment').width();
    $(document).bind("mousemove", function (ev) {
      $("#enviornment").css("flex-basis", width + x - ev.pageX);
    });
  });
  $("#sub-enviornment").mousedown(function (e) {
    e.stopPropagation();
  });
});