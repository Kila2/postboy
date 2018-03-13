import JSONEditor from 'jsoneditor';
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
class Service {
  static defaultList = [
    '31000101',
    '31000102',
    '31000301',
    '31000303',
    '31001501'
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
function GenCusJsonPacket(jsonString) {
  $.ajax({
      type: "post",
      url: "/PacketMocker/GenCustomJson",
      data: { "jsonString": jsonString },
      success: function (d) {
          if (d.Success) {
              // $("#txtSendPacket").val(d.Data);
              // $("#txtSendJsonPacket").val(d.Message);
              $.sticky("生成报文成功，见 [生成的报文] 文本框.", { autoclose: 3000, position: "top-center", type: "st-success" });
          }
          else {
            alert("Error:"+d.Error);
          }
      },
      cache: false,
      async: false
  });
}

$(document).ready(() => {
  const lefttabs = [['#history','#historyContent'],['#collections','#collectionsContent']];
  const toptabs = [['#builder',''],['#teamLibrary','']];
  const righttabs = [['#authorization',''],['#headers',''],['#body',''],['#pre-requestScript',''],['#tests','']];
  Tab.init(lefttabs);
  Tab.init(toptabs,'top');
  Tab.init(righttabs);
  //json editor
  var container = document.getElementById("jsoneditor");
  var options = {
    mode: 'code',
    ace: ace
  };
  var editor = new JSONEditor(container, options);


  const historylist = $('#historylist').find('ul');
  const serviceList = Service.defaultList;
  for(let i = 0; i<serviceList.length; i++){
    const item = $('<li></>');
    historylist.append(item);
    item.append($('<a></>').text(serviceList[i]).val(serviceList[i]));
    
    item.click((e)=>{

      $.ajax({
        headers: {"api":true},
        type: "get", 
        cache:  false,
        data:{
          Version:5,
          ServiceCode:10001001,
          SystemCode:17,
          ClientVersion:711,
          Encoding:3,
        },
        url: "/PacketMocker/GetJsonPacket"
      }).done((res)=>{
        // set json
        var json = JSON.parse(JSON.parse(res).Message);
        editor.set(json);
      });
    });
  }
  
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
