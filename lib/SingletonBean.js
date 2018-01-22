import User from './model/user';

export default class SingletonBean {
  static isLogin = true;
  constructor() {
    this.currentuser = new User();
  }
}
