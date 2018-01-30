import mongodb from 'mongodb';
import { DBHelper, Query } from  '../dbhelper';

const dbHelper = new DBHelper();

class BaseModel {
  _id = new mongodb.ObjectID();

  save(callback) {
    let query = new Query(this.constructor);
    query.equalTo('_id', this._id);
    let that = this;
    dbHelper.find(query, function (err, r) {
      if (r === null) {
        dbHelper.create(that, callback);
      }
      else {
        dbHelper.update(that, callback);
      }
    });
  }
  removeHiddenProperties() {
    //delete this.classname;
  }
}

export default class User extends BaseModel {
  constructor(name) {
    super();
    this.username = name;
    this.token = null;
    this.password = null;
  }
  removeHiddenProperties() {
    super.removeHiddenProperties();
    delete this.password;
  }
}

