import requestConfig from "./Config";
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
  static async getServiceResponse(serviceCode) {
    let res = await $.ajax({
      method: "get",
      cache: false,
      url: "/service/response/" + serviceCode
    });
    return res;
  }

  static async getResponse(scenceID) {
    let res = await $.ajax({
      method: "get",
      cache: false,
      url: "service/response?scenceid="+scenceID
    });
    return res;
  }

  static async getServiceScenceList(serviceCode,username) {
    let res = await $.ajax({
      method: "get",
      cache: false,
      url: "service/scenceList?servicecode="+serviceCode +"&username="+username
    });
    return res;
  }

  static async sendServiceToCtripService() {

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
      data: JSON.stringify(syncdata),
      contentType: "application/json"
    });
    return res;
  }
  static async getSyncConfig(syncdata) {
    let res = await $.ajax({
      method: "get",
      cache: false,
      url: "/sync?username="+requestConfig.username,
    });
    return res;
  }
}