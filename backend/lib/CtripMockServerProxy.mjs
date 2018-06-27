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
    'username' :uid,
    'scence':'default',
  };
  try{
    let r = await DBHelper.db.collection('mockuser').findOne(query);
    return res.send(r.response);
  }
  catch(e){
    console.log(e);
  }
  return res.send({errorcode:101});
});

export default router;


