import mongodb from 'mongodb';
import DBHelper from '../dbhelper';

const dbHelper = new DBHelper();

class BaseModel {
  classname = this.constructor.name;
  _id = new mongodb.ObjectID();
  create() {
    dbHelper.create(this);
  }
  remove() {
    Reflect.ownKeys(this);
  }
  update() {
    Reflect.ownKeys(this);
  }
  find() {
    Reflect.ownKeys(this);
  }
}

export default class User extends BaseModel {
  static instance = new User();
  static isLogin = User.instance.isLogin();
  constructor(name) {
    if (User.instance) {
      return User.instance;
    }
    super();
    this.name = name;
    this.token = null;
    this._isLogin = false;
    User.instance = this;
  }
  get isLogin() {
    return this._isLogin;
  }
  set isLoging(newValue) {
    this._isLogin = newValue;
  }
}

