import express from "express";
import DBHelper from '../lib/DBHelper';

const router = express.Router();
let cacheServiceList = undefined;
/* GET home page. */
router.get('/', function(req, res, next) {
  if(cacheServiceList === undefined){
    cacheServiceList = DBHelper.services
  }
  res.send({'services':cacheServiceList});
});
router.get('/:servicecode', async function(req, res, next) {
  let r = await DBHelper.db.collection('service').findOne({'servicecode':req.params.servicecode});
  let model = {};
  for (let o in r.response){
    model[o] = "";
  }
  res.send(JSON.stringify(model,null,2));
});
export default router;