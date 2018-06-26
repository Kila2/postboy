import express from "express";
import DBHelper from './DBHelper';

let router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res, next) {
  let uid = req.query.uid;
  let servicecode = req.query.servicecode;
  if(uid.trim() === '' || servicecode.trim() === '') {
    return res.send({
      resultCode:"10000",
      resultMessage:"uid不能为空或servicecode不能为空"
    });
  }
  let query = {
    'servicecode':servicecode,
    'uid' :uid,
    'scene':1,
  };
  let r = await DBHelper.db.collection('mockuser').findOne(query);
  let model = r.response;
  return res.send(JSON.stringify(model,null,2));
});

export default router;


