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
  constructor(name) {
    super();
    this.name = name;
    this.token = null;
  }
}

