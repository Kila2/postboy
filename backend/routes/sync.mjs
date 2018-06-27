import express from "express";
import DBHelper from '../lib/DBHelper';

let router = express.Router();

/* GET home page. */
router.put('/', async function(req, res, next) {
  let servicecode = req.body.servicecode;
  let scence = req.body.scence;
  let username = req.body.username;
  let query = {
    "username":username,
    "servicecode": servicecode,
    "scence":scence,
  };
  try{
    let model = {
      "username":username,
      "servicecode": servicecode,
      "scence":scence,
      "response":JSON.parse(req.body.response),
    };
    let rc = await DBHelper.db.collection('mockuser').findOneAndUpdate(query,{$set:model});
    if(rc.lastErrorObject.updatedExisting === false){
      DBHelper.db.collection('mockuser').insert(model)
    }
  }
  catch(e){
    console.log(e);
  }
  res.render({errorcode:0});
});

export default router;

