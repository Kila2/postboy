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
class Tab {
  static init(tabs, style){
    let select;
    let normal;
    switch(style){
      case 'top':
        select = 'nav-select';
        normal = 'nav-normal';
        break;
      default :
        select = 'navlightbg-select';
        normal = 'navlightbg-normal';
        break;
    }
    let baki = undefined;
    for(let i=0;i<tabs.length; i++){
      $(tabs[i][0])[0].controlViewTag = tabs[i][1];
      if($(tabs[i][0]).hasClass(select)){
        baki = $(tabs[i][0])[0]; 
      }
      $(tabs[i][0]).click((e)=>{
        if(e.currentTarget === baki){
          return;
        }
        $(baki).removeClass(select);
        $(baki).addClass(normal);
        $(baki.controlViewTag).attr('style','display:none !important');
        $(e.currentTarget).removeClass(normal);
        $(e.currentTarget).addClass(select);
        $(e.currentTarget.controlViewTag).show();
        baki = e.currentTarget;
      });
    }
  };
}
$(document).ready(() => {
  const lefttabs = [['#history','#historyContent'],['#collections','#collectionsContent']];
  const toptabs = [['#builder',''],['#teamLibrary','']];
  const righttabs = [['#authorization',''],['#headers',''],['#body',''],['#pre-requestScript',''],['#tests','']];
  
  Tab.init(lefttabs);
  Tab.init(toptabs,'top');
  Tab.init(righttabs);
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
  $('#Params').click((e)=>{
    const paramstable = $('#paramstable');
    if(paramstable.css('display')==='none'){
      paramstable.css('display','table');
    }
    else {
      paramstable.css('display','none');
    }
  });
});
