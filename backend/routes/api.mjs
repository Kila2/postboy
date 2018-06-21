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
  let model = await processModel(r.response);
  res.send(JSON.stringify(model,null,2));
});
async function processModel(res){
  let model = {};
  for (let o in res){
    switch(res[o].Metadata) {
      case "NullableClass": {
        let type = res[o].Type
        if(type.match(RegExp(/Response/i))){
          let m = await DBHelper.db.collection('service').findOne({'responsename':type});
          model[uncap_first(o)] = await processModel(m.response);
        }
        else if (type.match(RegExp(/Request/i))){
          let m = await DBHelper.db.collection('service').findOne({'requestname':type});
          model[uncap_first(o)] = await processModel(m.request);
        }
        else if(res[o].Fields !== undefined){
          model[uncap_first(o)] = await processModel(res[o].Fields);
        }
        else {
          model[uncap_first(o)] = "未定义";
        }
        break;
      }
      case "List":{
        if(res[o].Fields !== undefined){
          model[uncap_first(o)] = [await processModel(res[o].Fields)];
        }
        else {
          model[uncap_first(o)] = ["未定义"];
        }
        break;
      }
      default:
        model[uncap_first(o)] = "";
    }
  }
  return model;
}
function uncap_first(str){
  return str.substring(0,1).toLowerCase()+str.substring(1);
}
export default router;