import MongoClient from 'mongodb';
import assert from 'assert';
// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'mockserverdb';

const DBHelper = new class __DBHelper {
  constructor() {
    this.db = {};
    this.services = [];
  }
  init(callback) {
    // Use connect method to connect to the server
    MongoClient.connect(url, (err, client) => {
      assert.equal(null, err);
      console.log('Connected successfully to server');

      DBHelper.db = client.db(dbName);
      DBHelper.db.collection('service').find().toArray(function(err,rc){
        rc.forEach(item => {
          DBHelper.services.push(item.servicecode)
        });
        if(callback){
          callback();
        }
      });
    });
  }
}();

export default DBHelper;
