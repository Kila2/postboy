import express from "express";
import DBHelper from '../lib/DBHelper';

let router = express.Router();

/* GET home page. */
router.put('/', async function (req, res, next) {
  try {
    let body = req.body;
    let configData = body.configData;
    let username = configData.username;
    {
      let responseData = body.responseData;
      if (responseData !== undefined) {
        let servicecode = responseData.servicecode;
        let scence = responseData.scence;
        let model = {
          "username": username,
          "servicecode": servicecode,
          "scence": scence,
          "response": responseData.response,
          "date": new Date(),
        };
        let query = {
          "username": username,
          "servicecode": servicecode,
          "scence": scence,
        };
        if (scence !== 'default' && scence && scence.trim() !== '') {
          let rc = await DBHelper.db.collection('scence').findOneAndUpdate(query, {$set: model});
        }
        if (rc.lastErrorObject.updatedExisting === false) {
          DBHelper.db.collection('scence').insert(model)
        }
      }
    }
    {
      let query = {
        "username": username
      };
      let rc = await DBHelper.db.collection('userconfig').findOneAndUpdate(query, {$set: configData});
      if (rc.lastErrorObject.updatedExisting === false) {
        await DBHelper.db.collection('userconfig').insert(configData)
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

router.get('/', async function (req, res, next) {
  try {
    let username = req.query.username;
    let query = {
      "username": username
    };
    let rc = await DBHelper.db.collection('userconfig').findOne(query);
    if (rc !== null) {
      res.send(rc);
    }
    else {
      res.send({
        errorcode: 101,
        errormsg: 'username:' + username + ' not found',
      });
    }

  }
  catch (e) {
    res.send({
      errorcode: 102,
      errormsg: e.message,
      errorstack: e.stack,
    });
  }

});

export default router;

