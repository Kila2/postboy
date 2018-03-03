$(document).ready(() => {
  
  $(window).resize(() => {
    const height = $('#rightcontent').height();
    $('#resultcontent').css('height', height - 110);
    const width = $('#rightcontent').width();
    $('#urlbar').css('width',width-15);
  });
  $(document).ready((ev) => {
    const height = $('#rightcontent').height();
    $('#resultcontent').css('height', height - 110);
    const width = $('#rightcontent').width();
    $('#urlbar').css('width',width-15);
  });

  $('#left').mousedown((e) => {
    $(document).bind('mousemove', (ev) => {
      if (ev.pageX >= 200 && ev.pageX <= 500) {
        $('#left').css('flex-basis', ev.pageX);
        const width = $('#rightcontent').width();
        $('#urlbar').css('width',width-15);
      }
    });
  });
  $(document).mouseup(function () {
    $(this).unbind('mousemove');
  });
  $('#enviornment').mousedown((e) => {
    const x = e.pageX;
    const y = e.pageY;
    const width = $('#enviornment').width();
    $(document).bind('mousemove', (ev) => {
      $('#enviornment').css('flex-basis', width + x - ev.pageX);
    });
  });
  $('#sub-enviornment').mousedown((e) => {
    e.stopPropagation();
  });
});
