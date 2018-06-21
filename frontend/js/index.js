import {JSONEditor} from './vendor';

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

  static getList(callback) {
    if (Service.defaultList.length === 0) {
      $.ajax({
        type: "get",
        cache: false,
        url: "/service"
      }).done((res) => {
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
  static init(tabs, style) {
    let select;
    let normal;
    switch (style) {
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
    for (let i = 0; i < tabs.length; i++) {
      $(tabs[i][0])[0].controlViewTag = tabs[i][1];
      if ($(tabs[i][0]).hasClass(select)) {
        baki = $(tabs[i][0])[0];
      }
      $(tabs[i][0]).click((e) => {
        if (e.currentTarget === baki) {
          return;
        }
        $(baki).removeClass(select);
        $(baki).addClass(normal);
        $(baki.controlViewTag).attr('style', 'display:none !important');
        $(e.currentTarget).removeClass(normal);
        $(e.currentTarget).addClass(select);
        $(e.currentTarget.controlViewTag).show();
        baki = e.currentTarget;
      });
    }
  };
}

$(document).ready(() => {
  const lefttabs = [['#primary', '#primaryContent'], ['#internation', '#internationContent']];
  const toptabs = [['#builder', ''], ['#teamLibrary', '']];
  const righttabs = [['#authorization', ''], ['#headers', ''], ['#body', ''], ['#pre-requestScript', ''], ['#tests', '']];
  Tab.init(lefttabs);
  Tab.init(toptabs, 'top');
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

  Service.getList(function (serviceList) {
    for (let i = 0; i < serviceList.length; i++) {
      const item = $('<li></li>');
      item.append($('<a></a>').text(serviceList[i]).val(serviceList[i]));
      item.click((e) => {
        if($(e.currentTarget).parent().parent('#internationlist').length == 1){
          sortAndSaveByClickTimes(e.currentTarget,'internationServiceClickTimes','#internationlist');
        }
        else {
          sortAndSaveByClickTimes(e.currentTarget,'primaryServiceClickTimes','#primarylist');
        }
        generationResponse();
      });

      function sortAndSaveByClickTimes(target,localKey,parendId) {
        let ct = parseInt($(target).attr("ct"), 10) || 0;
        ct++;
        $(target).attr('ct', ct);
        let items = $(parendId).find('li');
        items.sort(function (a, b) {
          let cta = parseInt($(a).attr("ct")) || 0;
          let ctb = parseInt($(b).attr("ct")) || 0;
          if (cta === ctb) {
            let serviceCodeA = parseInt($(a).children().text()) || 0;
            let serviceCodeB = parseInt($(b).children().text()) || 0;
            return serviceCodeB - serviceCodeA;
          }
          return ctb - cta;
        });
        let serviceClickTimesBackup = {};
        for (let i = 0; i < items.length; i++) {
          $(parendId).children().append(items[i]);
          let serviceCode = $(items[i]).children().text();
          serviceClickTimesBackup[serviceCode] = parseInt($(items[i]).attr("ct"), 10) || 0;
        }
        localStorage[localKey] = JSON.stringify(serviceClickTimesBackup);
      }

      function generationResponse() {
        $.ajax({
          type: "get",
          cache: false,
          url: "/service/" + serviceList[i]
        }).done((res) => {
          // set json
          let json = JSON.parse(res);
          editor.set(json);
        });
      }

      function proxyApi() {
        $.ajax({
          headers: {"api": true},
          type: "get",
          cache: false,
          data: {
            Version: 5,
            ServiceCode: serviceList[i],
            SystemCode: 17,
            ClientVersion: 711,
            Encoding: 3,
          },
          url: "/PacketMocker/GetJsonPacket"
        }).done((res) => {
          // set json
          let json = JSON.parse(JSON.parse(res).Message);
          editor.set(json);
        });
      }
      initItemClickTime(item,"primaryServiceClickTimes",serviceList[i]);
      primarylist.append(item);
      let itemCopy = item.clone(true);
      initItemClickTime(itemCopy,"internationServiceClickTimes",serviceList[i]);
      internationlist.append(itemCopy);
    }
    function initItemClickTime(item,localKey,serviceCode){
      if (localStorage[localKey] === undefined) {
        localStorage[localKey] = "{}";
      }
      let serviceClickTimes = JSON.parse(localStorage[localKey]);
      item.attr("ct", serviceClickTimes[serviceCode] || 0);
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
  $('#Params').click((e) => {
    const paramstable = $('#paramstable');
    if (paramstable.css('display') === 'none') {
      paramstable.css('display', 'table');
    }
    else {
      paramstable.css('display', 'none');
    }
  });
});
