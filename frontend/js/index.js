import {JSONEditor} from './vendor';
import url from "url";
import requestConfig from './Config';

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

class Api {
  static defaultList = [];
  static packet = "";

  static async getList() {
    if (Api.defaultList.length === 0) {
      let result = await $.ajax({
        type: "get",
        cache: false,
        url: "/service"
      });
      Api.defaultList = result.services;
      return Api.defaultList;
    }
    else {
      return Api.defaultList;
    }
  }

  static async generationRequest(aURL) {
    let aURLObj = url.parse(aURL, true, true);
    let res = await $.ajax({
      headers: {
        api: true,
        proxyreferer: "http://10.2.56.40:8080/"
      },
      method: "get",
      cache: false,
      data: aURLObj.query,
      url: aURLObj.pathname,
    });
    const settings = {
      "async": true,
      "crossDomain": true,
      "url": "/PacketMocker/GenCustomJson",
      "method": "POST",
      "headers": {
        api: true,
        proxyreferer: "http://10.2.56.40:8080/",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,ja;q=0.7",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Accept": "*/*",
        "X-Requested-With": "XMLHttpRequest",
        "Cache-Control": "no-cache",
      },
      "data": "jsonString=" + res.Data
    };

    let secondRes = await $.ajax(settings);
    Api.packet = secondRes.Data;

    let realResponse = JSON.parse(secondRes.Message);
    let thirdRes = await $.ajax({
      type: "get",
      cache: false,
      url: "/service?serviceCode=" + aURLObj.query['ServiceCode'] + '&type=request'
    });
    realResponse.Body = JSON.parse(thirdRes);
    return realResponse;
  }

  static async getResponseList(serviceCode) {
    let res = await $.ajax({
      method: "get",
      cache: false,
      url: "service/response?servicecode="+serviceCode +"&username=lee"
    });
    return JSON.parse(res);
  }
  static async generationResponse(serviceCode) {
    let res = await $.ajax({
      method: "get",
      cache: false,
      url: "/service/" + serviceCode
    });
    return JSON.parse(res);
  }

  static async generationResponseLastUse(uid,serviceCode) {
    let res = await $.ajax({
      method: "get",
      cache: false,
      url: "/service/" + serviceCode +"?uid=" + uid +'&last=1',
    });
    return res;
  }

  static async sendServiceToCtripService(callback) {

    let settings = {
      async: true,
      crossDomain: true,
      url: "/PacketMocker/SendTcp",
      method: "POST",
      headers: {
        api: true,
        proxyreferer: "http://10.2.56.40:8080/",
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        Accept: "*/*",
        cache: false,
        "X-Requested-With": "XMLHttpRequest",
      },
      data: "ip=10.2.240.118" +
      "&port=443" +
      "&packet=" + Api.packet +
      "&systemCode=32" +
      "&clientVersion=602"
    };

    let response = await $.ajax(settings);
    return JSON.parse(response['Message']).Body;
  }

  static async syncConfig(syncdata) {
    let res = await $.ajax({
      method: "put",
      cache: false,
      url: "/sync/",
      data: syncdata,
    });
    return res;
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


$(document).ready(async () => {
  let uid = 'lee';
  let scence = 'default';
  const lefttabs = [['#serviceTab', '#serviceListContent'], ['#history', '#historyContent']];
  const toptabs = [['#builder', ''], ['#teamLibrary', '']];
  const righttabs = [['#authorization', ''], ['#headers', ''], ['#body', ''], ['#pre-requestScript', ''], ['#tests', '']];
  const settingTabs = [['#cratenew', ''], ['#templates', ''], ['#apinetwork', '']];

  //json editor
  const container = document.getElementById("jsoneditor");
  const options = {
    mode: 'code',
    ace: ace,
    onChange: () => {
      onResponseEdited();
    }
  };
  const editor = new JSONEditor(container, options);

  const requestbodyeditorContainer = document.getElementById("requestbodyeditor");
  const options2 = {
    modes: ['code', 'text'],
    ace: ace,
  };
  const requestbodyeditor = new JSONEditor(requestbodyeditorContainer, options2);

  //service列表
  const servicelist = $('#serviceList').find('ul');

  //请求method列表 e.g. get post put delete
  const methodList = $('#httpmethod-btn').find('div');
  //method数组
  const methods = HTTP.methods;

  //url input
  const urlInput = $('#urlInput');
  //参数列表
  const paramstable = $('#paramstable');
  //参数表格
  const paramsContent = $('#paramsContent');

  //初始化tab
  Tab.init(lefttabs);
  Tab.init(toptabs, 'top');
  Tab.init(righttabs);
  Tab.init(settingTabs);
  //响应布局相关
  layoutMoveAction();
  //点击事件
  clickAction();

  //init method list
  for (let i = 0; i < methods.length; i += 1) {
    const item = $('<a class="dropdown-item" href="#"></a>').text(methods[i]);
    methodList.append(item);
  }

  //init service list
  await initServiceList();
  //对servicelist 的元素排序
  sortItems(servicelist);

  bindURLAndParams();

  //checkbox click
  initCheckBoxClickAction();

  //private function
  let syncTimeout = undefined;

  function onResponseEdited() {
    $('#syncresponse').text('UNSYNC');
    $('#syncresponse').css('color','red');
    clearTimeout(syncTimeout);
    syncTimeout = setTimeout(() => {
      syncResponse();
    }, 5e3);//default 5s;
  }

  async function syncResponse(){
    let servicecode = $('#rightResponseTitle').val().trim() || '';
    if(servicecode === ''){
      return;
    }
    let json = editor.get();
    let syncData = {
      username: uid,
      scence: scence,
      servicecode: $('#rightResponseTitle').val(),
      response: JSON.stringify(json),
    };
    $('#syncresponse').text('IN SYNC...');
    $('#syncresponse').css('color','red');
    let rc = await Api.syncConfig(syncData);
    $('#syncresponse').text('SYNC OK');
    $('#syncresponse').css('color','green');
  }

  function initCheckBoxClickAction() {
    $('#left').find(':checkbox').click((e) => {
      let check = $(e.currentTarget).prop('checked');
      if (check === true) {
        // let syncData = {
        //   username: 'lee',
        //   scence: 'default',
        //   servicecode: '31000101'
        // }
        // Api.syncConfig();
        console.log(check);
      }
    });
  }

  function bindURLAndParams() {
    let tfoot = paramstable.find('tfoot').children();

    urlInput.on('input propertychange', (ev) => {
      let query = parseQueryString(urlInput.val());
      paramsContent.children().remove();
      for (let i = 0; i < query.length; i++) {
        let item = tfoot.clone(false);
        let inputs = item.find('input');
        let key = $(inputs[0]);
        let value = $(inputs[1]);
        let description = $(inputs[2]);
        inputs.attr('placeholder', '');
        key.val(query[i].key);
        value.val(query[i].value);
        paramsContent.append(item);
        item.find('input').on('input propertychange', () => {
          paramsInputBind();
        });
      }
    });

    tfoot.find('input').on('input propertychange', (ev) => {
      $(ev.currentTarget).blur();
      let item = tfoot.clone(false);
      paramsContent.append(item);
      tfoot.find('input').val('');
      let index = $(ev.currentTarget).parent().prevAll().find('input').length;
      $(item.find('input')[index]).focus();
      $(item.find('input')[index]).putCursorAtEnd();
      item.find('input').on('input propertychange', () => {
        paramsInputBind();
      });
      paramsInputBind();
    });
  }

  function paramsInputBind() {
    let origin = urlInput.val().substring(0, urlInput.val().indexOf("?") + 1);
    if (origin.indexOf("?") === -1) {
      origin += '?';
    }
    let inputs = paramsContent.find('input');
    for (let i = 0; i < inputs.length; i++) {
      if (i % 3 === 0) {
        //key
        origin += $(inputs[i]).val() + '=';
      }
      else if (i % 3 === 1) {
        //value
        origin += $(inputs[i]).val() + '&';
      }
    }
    origin = origin.substring(0, origin.length - 1);
    urlInput.val(origin);
  }

  function parseQueryString(aURL) {
    let obj = [];
    if (aURL.indexOf("?") === -1) {
      return obj;
    }
    let bURL = aURL.substring(aURL.indexOf("?") + 1);
    let urlArr = bURL.split("&");
    let key, value, index;
    for (let i = 0; i < urlArr.length; i++) {
      index = urlArr[i].indexOf("=");
      if (index === -1) {
        key = urlArr[i].substring(index + 1);
        value = "";
      }
      else {
        key = urlArr[i].substring(0, index);
        value = urlArr[i].substring(index + 1);
      }
      if (key.trim() !== '') {
        obj[i] = {key, value};
      }
    }
    return obj;
  }

  //ini servicelist item
  async function initServiceList() {
    const serviceList = await Api.getList();
    for (let i = 0; i < serviceList.length; i++) {
      const item = $(`<li class="input-group;flex-direction: column"></li>`);
      item.append($(
        `<div class="d-flex flex-row">
            <div class="input-group-prepend">
                <input type="checkbox">
            </div>
            <a style="width:80px">${serviceList[i]}</a>
            <div class="rebutton">
                <button>req</button>
                <button data-toggle="collapse" href=#${serviceList[i]}collapse>res</button>
            </div>
        </div>
        <div class="collapse" id=${serviceList[i]}collapse>
            <div class="card card-body">
            </div>
        </div>`
      ));

      let reqItem = $(item.find('.rebutton').children()[0]);
      let resItem = $(item.find('.rebutton').children()[1]);
      reqItem.click(async (e) => {
        urlInput.val('http://10.2.56.40:8080/PacketMocker/GetJsonPacket?'
          + 'ServiceCode=' + serviceList[i]
          + '&Version=' + requestConfig.Version
          + '&SystemCode=' + requestConfig.SystemCode
          + '&ClientVersion=' + requestConfig.ClientVersion
          + '&Encoding=' + requestConfig.Encoding);
        urlInput.trigger('input');
        //2 is internation
        saveClickTimes(e.currentTarget);
        let preRequestData = await Api.generationRequest(urlInput.val());
        requestbodyeditor.set(preRequestData);
        $('#rightResponseTitle').text('Response');
        $('#rightResponseTitle').val('');
        editor.set({});
      });
      resItem.click(async (e) => {

      let target = $(e.currentTarget);
        await initScenceList(serviceList[i]);
        // await syncResponse();
        // urlInput.val("http://10.2.56.40:8080/PacketMocker/GetJsonPacket?" + "ServiceCode=" + serviceList[i] + "&Version=5&" + "SystemCode=17&" + "ClientVersion=711&" + "Encoding=3");
        // urlInput.trigger('input');
        // saveClickTimes(e.currentTarget);
        // let serviceResponseData = await Api.generationResponse(serviceList[i]);
        // editor.set(serviceResponseData);
        // let title = serviceList[i] || '';
        // $('#rightResponseTitle').val(title);
        // title += ' Response';
        // $('#rightResponseTitle').text(title);
      });

      initItemClickTime(item, serviceList[i]);
      servicelist.append(item);
    }
  }

  async function initScenceList(servicecode) {
    let responses =  await Api.getResponseList(servicecode) || {services:[]};
    $("#"+servicecode+"collapse").children().children().remove();
    for(let response of responses.services) {
      const item = $('<label></label>');
      item.append($(`<input type="radio" name=${servicecode}radio value="${response.scence}"/>`));
      item.append(response.scence);
      $("#"+servicecode+"collapse").children().append(item);
    }
  }

  //sort items by click times
  function sortItems(list) {
    let items = list.children();
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
    for (let i = 0; i < items.length; i++) {
      list.append(items[i]);
    }
  }

  //save item click times
  function saveClickTimes(target) {
    let ct = parseInt($(target).parent().parent().attr("ct"), 10) || 0;
    ct++;
    $(target).parent().parent().attr('ct', ct);
    let items = $(servicelist).find('li');
    let serviceClickTimesBackup = {};
    for (let i = 0; i < items.length; i++) {
      $(servicelist).children().append(items[i]);
      let serviceCode = $(items[i]).find('a').text().trim();
      serviceClickTimesBackup[serviceCode] = parseInt($(items[i]).attr("ct"), 10) || 0;
    }
    if (requestConfig.appVer === "2") {
      localStorage["internationServiceClickTimes"] = JSON.stringify(serviceClickTimesBackup);
    }
    else {
      localStorage["primaryServiceClickTimes"] = JSON.stringify(serviceClickTimesBackup);
    }

  }

  function initItemClickTime(item, serviceCode) {
    let localKey = "";
    if(requestConfig.appVer ===  "2"){
      localKey = "internationServiceClickTimes";
    }
    else {
      localKey = "primaryServiceClickTimes";
    }

    if (localStorage[localKey] === undefined) {
      localStorage[localKey] = "{}";
    }
    let serviceClickTimes = JSON.parse(localStorage[localKey]);
    item.attr("ct", serviceClickTimes[serviceCode] || 0);

  }
  //modal dismiss action
  $('#settingModal').on('mouseup.dismiss.bs.modal', async function (e) {
    requestConfig.appVer =  $('#settingModal').find('div[name=appVer]').find(":checked").val() || 1;
    let inputs = $('#settingModal').find('tbody').find('input');
    for(let aInput of inputs){
      requestConfig[$(aInput).attr('name')] = $(aInput).val();
    }
    servicelist.children().remove();
    await initServiceList();
    sortItems(servicelist);
    if(requestConfig.appVer === "1"){
      $('#serviceTab').text('主版');
    }
    else {
      $('#serviceTab').text('国际版');
    }


  });
  //click action
  function clickAction() {
    $('#Params').click(() => {
      if (paramstable.css('display') === 'none') {
        paramstable.css('display', 'table');
      }
      else {
        paramstable.css('display', 'none');
      }
    });

    $('#SendRequest').click(async () => {
      let realResponse = await Api.sendServiceToCtripService();
      if (typeof realResponse === 'string') {
        realResponse = JSON.parse(realResponse);
      }
      let title = requestbodyeditor.get().Head.ServiceCode || '';
      $('#rightResponseTitle').val(title);
      title += ' Response';
      $('#rightResponseTitle').text(title);

      editor.set(realResponse);
    });
  }

  //move layout action
  $('#paramsSwitchBar').find('button').click((e) => {
    let id = $(e.currentTarget).attr('id');
    let idContent = '#' + id + 'Content';
    $.find('.d-flex[name=paramsContent]').forEach((item) => {
      console.log($(item));
      $(item).css('cssText', 'display:none !important');
    });
    $(idContent).css('cssText', 'display:flex !important');
    console.log(id);
  });

  function layoutMoveAction() {
    const rightcontent = $('#rightcontent');
    $(window).resize(() => {
      const height = rightcontent.height();
      $('#resultcontent').css('height', height - 110);
      const width = rightcontent.width();
      $('#urlbar').css('width', width - 15);
    });

    $(document).ready(() => {
      const height = rightcontent.height();
      $('#resultcontent').css('height', height - 110);
      const width = rightcontent.width();
      $('#urlbar').css('width', width - 15);
    });

    $('#left').mousedown(() => {
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
  }
});
