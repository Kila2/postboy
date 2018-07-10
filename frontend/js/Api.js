import requestConfig from "./UserConfig";
import url from "url";

export default class Api {
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

  static async getServiceResponse(serviceCode) {
    return await $.ajax({
      method: "get",
      cache: false,
      url: "/service/" + serviceCode
    });
  }

  static async genCustomJson(dataString){
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
      "data": "jsonString=" + dataString
    };
    let secondRes = await $.ajax(settings);

    Api.packet = secondRes.Data;
    return secondRes;
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

    let secondRes = await Api.genCustomJson(res.Data);
    //Api.packet = secondRes.Data;
    let realResponse = JSON.parse(secondRes['Message']);
    let thirdRes = await $.ajax({
      type: "get",
      cache: false,
      url: "/service?serviceCode=" + aURLObj.query['ServiceCode'] + '&type=request'
    });
    realResponse.Body = JSON.parse(thirdRes);
    return realResponse;
  }

  static async getResponse(scenceID) {
    return await $.ajax({
      method: "get",
      cache: false,
      url: "scence/" + scenceID
    });
  }

  static async getServiceScenceList(serviceCode) {
    return await $.ajax({
      method: "get",
      cache: false,
      url: "scence?servicecode=" + serviceCode + "&username=" + requestConfig.username
    });
  }

  static async addServiceScence(serviceCode,scenceName) {
    return await $.ajax({
      method: "post",
      cache: false,
      url: "scence",
      data: {
        servicecode: serviceCode,
        scencename: scenceName,
        username: requestConfig.username,
      }
    });
  }


  static async sendServiceToCtripService(data) {
    let body = data.Body;
    data.Body = {};
    await Api.genCustomJson(JSON.stringify(data));
    data.Body = body;

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
    return await $.ajax({
      method: "put",
      cache: false,
      url: "/sync/",
      data: JSON.stringify(syncdata),
      contentType: "application/json"
    });
  }
  static async getSyncConfig() {
    return await $.ajax({
      method: "get",
      cache: false,
      url: "/sync?username=" + requestConfig.username,
    });
  }
}