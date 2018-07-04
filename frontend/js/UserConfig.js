import Api from './Api';

class Config {
  constructor(){
    this.username = localStorage["username"] || "";
    this.username = this.username.trim();
    this.appVer = 1;//1主板，2国际版
    this.Version = 5;//通信协议版本号
    this.SystemCode = 17;//17 iOS
    this.ClientVersion = 711;//客户端版本
    this.Encoding = 3;//请求返回JSON
    this.ServiceConfig = {
      internation:{},//主版配置文件
      primary:{},//国际版配置文件
    };
  }
  async sync(){
    if(this.username !== ""){
      let res = await Api.getSyncConfig();
      delete res._id;
      this.setConfig(res);1
    }
  }

  getSelectedScenceID(serviceCode){
    let serviceCodeConfig;
    if(this.appVer === 1){
      serviceCodeConfig = this.ServiceConfig.primary[serviceCode];
    }
    else {
      serviceCodeConfig = this.ServiceConfig.internation[serviceCode];
    }
    return serviceCodeConfig !== undefined ? (serviceCodeConfig['selectScenceID'] || 'default') : 'default';
  }
  setSelect(serviceCode,selectScenceID) {
    if(this.appVer === 1){
      if(this.ServiceConfig.primary[serviceCode] === undefined){
        this.ServiceConfig.primary[serviceCode] = {};
      }
      this.ServiceConfig.primary[serviceCode]['selectScenceID'] = selectScenceID;
    }
    else {
      if(this.ServiceConfig.internation[serviceCode] === undefined){
        this.ServiceConfig.internation[serviceCode] = {};
      }
      this.ServiceConfig.internation[serviceCode]['selectScenceID'] = selectScenceID;
    }
  }
  getChecked(serviceCode){
    let serviceCodeConfig;
    if(this.appVer === 1){
      serviceCodeConfig = this.ServiceConfig.primary[serviceCode];
    }
    else {
      serviceCodeConfig = this.ServiceConfig.internation[serviceCode];
    }
    return serviceCodeConfig !== undefined ? (serviceCodeConfig['checked'] || false) : false;
  }
  setChecked(serviceCode,isChecked) {
    if(this.appVer === 1){
      if(this.ServiceConfig.primary[serviceCode] === undefined){
        this.ServiceConfig.primary[serviceCode] = {};
      }
      this.ServiceConfig.primary[serviceCode]['checked'] = isChecked;
    }
    else {
      if(this.ServiceConfig.internation[serviceCode] === undefined){
        this.ServiceConfig.internation[serviceCode] = {};
      }
      this.ServiceConfig.internation[serviceCode]['checked'] = isChecked;
    }
  }
  setConfig(config){
    for (let key in config){
      this[key] = config[key];
    }
    this.username = this.username.trim();
  }
}
let config = new Config();

export default config;