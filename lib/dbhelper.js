import { MongoClient } from 'mongodb';
// import json from ;
const url = 'mongodb://localhost:27017/mockserverdb';


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

  create(obj) {
    if (Reflect.has(obj, 'classname')) {
      let classname = Reflect.get(obj, 'classname');
      let collection = this.connectionData.db.collection(classname);
      collection.insertOne(obj, function (err, result) {
        if (err) throw err;
      });
    }
  }

  remove(obj) {
    if (Reflect.has(obj, 'classname')) {
      let classname = Reflect.get(obj, 'classname');
      let collection = this.connectionData.db.collection(classname);
      collection.removeOne(obj, function (err, result) {
        if (err) throw err;
      });
    }
  }

  update(obj) {
    if (Reflect.has(obj, 'classname')) {
      let classname = Reflect.get(obj, 'classname');
      let collection = this.connectionData.db.collection(classname);
      collection.updateOne(obj, function (err, result) {
        if (err) throw err;
      });
    }
  }

  find(obj) {
    if (Reflect.has(obj, 'classname')) {
      let classname = Reflect.get(obj, 'classname');
      let collection = this.connectionData.db.collection(classname);
      collection.find(obj, function (err, result) {
        if (err) throw err;
      });
    }
  }
}
