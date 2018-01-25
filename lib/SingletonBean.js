import User from './model/user';

export default class SingletonBean {
  static isLogin = false;
  constructor() {
    this.currentuser = new User();
  }
}
