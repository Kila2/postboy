import { MongoClient } from 'mongodb';
// import json from ;
const url = 'mongodb://localhost:27017/mockserverdb';

class Query {
  classname;
  condations;

  constructor(aClass) {
    this.classname = aClass.name;
    this.condations = new Map();
  }

  equalTo(key, value) {
    this.condations.set(key, value);
  }

  lessThan() {

  }
  lessThanAndEqualTo() {

  }
  greaterThan() {

  }

  greaterThanAndEqualTo() {

  }
  notEqual() {

  }
}

export default class DBHelper {
  static instance;
  connectionData = {
    // db:            undefined,
  };

  static init() {
    DBHelper.instance = new DBHelper();
  }
  constructor() {
    if (DBHelper.instance) {
      return DBHelper.instance;
    }
    let that = this;
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      that.connectionData.db = db;
    });
  }

  create(obj, callback) {
    if (obj.constructor.name !== null) {
      let classname = obj.constructor.name;
      let collection = this.connectionData.db.collection(classname);
      collection.insertOne(obj, callback);
    }
  }

  remove(obj, callback) {
    if (obj.constructor.name !== null) {
      let classname = obj.constructor.name;
      let collection = this.connectionData.db.collection(classname);
      collection.removeOne(obj, callback);
    }
  }

  update(obj, callback) {
    if (obj.constructor.name !== null) {
      let classname = obj.constructor.name
      let collection = this.connectionData.db.collection(classname);
      collection.updateOne({ _id:obj._id }, obj, callback);
    }
  }

  find(query, callback) {
    if (Reflect.has(query, 'classname')) {
      let classname = query.classname;
      let collection = this.connectionData.db.collection(classname);
      collection.findOne(query.condations, callback);
    }
  }
}

export {
  DBHelper,
  Query,
};
