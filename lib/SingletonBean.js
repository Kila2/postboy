import User from './model/user';

export default class SingletonBean {
  constructor() {
    this.currentuser = new User();
  }
}
