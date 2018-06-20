import { JSONEditor } from './vendor';
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
  static defaultList = [];
  static getList(callback){
    if(Service.defaultList.length === 0){
      $.ajax({
        type: "get",
        cache:  false,
        url: "/service"
      }).done((res)=>{
        // set json
        Service.defaultList = res.services;
        callback(Service.defaultList);
      });
    }
    else {
      callback(Service.defaultList);
    }
  }

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
  const lefttabs = [['#primary','#primaryContent'],['#internation','#internationContent']];
  const toptabs = [['#builder',''],['#teamLibrary','']];
  const righttabs = [['#authorization',''],['#headers',''],['#body',''],['#pre-requestScript',''],['#tests','']];
  Tab.init(lefttabs);
  Tab.init(toptabs,'top');
  Tab.init(righttabs);
  //json editor
  let container = document.getElementById("jsoneditor");
  let options = {
    mode: 'code',
    ace: ace
  };
  let editor = new JSONEditor(container, options);


  const primarylist = $('#primarylist').find('ul');
  const internationlist = $('#internationlist').find('ul');
  Service.getList(function(serviceList){
    for(let i = 0; i<serviceList.length; i++){
      const item = $('<li></li>');
      item.append($('<a></a>').text(serviceList[i]).val(serviceList[i]));

      item.click((e)=>{
          proxyApi();
      });
      function generationResponse(){
        $.ajax({
          headers: {"api":true},
          type: "get",
          cache:  false,
          data:{
            Version:5,
            ServiceCode:serviceList[i],
            SystemCode:17,
            ClientVersion:711,
            Encoding:3,
          },
          url: "/PacketMocker/GetJsonPacket"
        }).done((res)=>{
          // set json
          let json = JSON.parse(JSON.parse(res).Message);
          editor.set(json);
        });
      }
      function proxyApi(){
        $.ajax({
          headers: {"api":true},
          type: "get",
          cache:  false,
          data:{
            Version:5,
            ServiceCode:serviceList[i],
            SystemCode:17,
            ClientVersion:711,
            Encoding:3,
          },
          url: "/PacketMocker/GetJsonPacket"
        }).done((res)=>{
          // set json
          let json = JSON.parse(JSON.parse(res).Message);
          editor.set(json);
        });
      }
      primarylist.append(item);
      internationlist.append(item.clone(true));
    }
  });

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
