class HTTP {
  static methods = [
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'COPY',
    'HEAD',
    'OPTIONS',
    'LINK',
    'UNLINK',
    'PURGE',
    'LOCK',
    'UNLOCK',
    'PROPFIND',
    'VIEW',
  ];
}
$(document).ready(() => {
  const methodList = $('#httpmethod-btn').find('div');
  const methods = HTTP.methods;
  for (let i = 0; i < methods.length; i += 1) {
    const item = $('<a class="dropdown-item" href="#"></a>').text(methods[i]);
    methodList.append(item);
  }
  const rightcontent = $('#rightcontent');
  $(window).resize(() => {
    const height = rightcontent.height();
    $('#resultcontent').css('height', height - 110);
    const width = rightcontent.width();
    $('#urlbar').css('width', width - 15);
  });
  $(document).ready((ev) => {
    const height = rightcontent.height();
    $('#resultcontent').css('height', height - 110);
    const width = rightcontent.width();
    $('#urlbar').css('width', width - 15);
  });

  $('#left').mousedown((e) => {
    $(document).bind('mousemove', (ev) => {
      if (ev.pageX >= 200 && ev.pageX <= 500) {
        $('#left').css('flex-basis', ev.pageX);
        const width = rightcontent.width();
        $('#urlbar').css('width', width - 15);
      }
    });
  });
  $(document).mouseup(() => {
    $(document).unbind('mousemove');
  });
  $('#enviornment').mousedown((e) => {
    const x = e.pageX;
    const width = $('#enviornment').width();
    $(document).bind('mousemove', (ev) => {
      $('#enviornment').css('flex-basis', width + x - ev.pageX);
    });
  });
  $('#sub-enviornment').mousedown((e) => {
    e.stopPropagation();
  });
});
