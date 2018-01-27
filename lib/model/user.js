import mongodb from 'mongodb';
import DBHelper from '../dbhelper';

const dbHelper = new DBHelper();

class BaseModel {
  classname = this.constructor.name;
  _id = new mongodb.ObjectID();
  save() {
    dbHelper.create(this);
  }
}

export default class User extends BaseModel {
  constructor(name) {
    super();
    this.name = name;
    this.token = null;
  }
}

