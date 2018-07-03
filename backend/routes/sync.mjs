import express from "express";
import DBHelper from '../lib/DBHelper';

let router = express.Router();

/* GET home page. */
router.put('/', async function (req, res, next) {
  try {
    let body = req.body;
    let responseData = body.responseData;
    let servicecode = responseData.servicecode;
    let scence = responseData.scence;
    let configData = body.configData;
    let username = configData.username;
    let model = {
      "username": username,
      "servicecode": servicecode,
      "scence": scence,
      "response": responseData.response,
      "date": new Date(),
    };
    {
      let query = {
        "username": username,
        "servicecode": servicecode,
        "scence": scence,
      };
      let rc = await DBHelper.db.collection('mockuser').findOneAndUpdate(query, {$set: model});
      if (rc.lastErrorObject.updatedExisting === false) {
        DBHelper.db.collection('mockuser').insert(model)
      }
    }
    {
      let query = {
        "username": username
      };
      let rc = await DBHelper.db.collection('useconfig').findOneAndUpdate(query, {$set: configData});
      if (rc.lastErrorObject.updatedExisting === false) {
        DBHelper.db.collection('useconfig').insert(configData)
      }
    }
    res.send({errorcode: 0});
  }
  catch (e) {
    res.send({
      errorcode: e.message,
      errorstack: e.stack,
    });
  }

});

export default router;

