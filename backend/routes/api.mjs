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
export default router;