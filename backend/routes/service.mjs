import express from 'express';
import DBHelper from '../lib/DBHelper';
import MongoDB from "mongodb";
const ObjectID = MongoDB.ObjectID;

const router = express.Router();
let cacheServiceList = undefined;

/* GET home page. */
router.get('/', async function(req, res, next) {
  if(Object.keys(req.query).length === 1 && Object.keys(req.query)[0] === '_'){
    if(cacheServiceList === undefined){
      cacheServiceList = DBHelper.services
    }
    return res.send({'services':cacheServiceList});
  }

  else if(req.query.type === 'request'){
    if(req.query.serviceCode === undefined || req.query.serviceCode.trim() === ''){
      return res.send({error:'serviceCode is empty'});
    }
    let r = await DBHelper.db.collection('service').findOne({'servicecode':req.query.serviceCode});
    let model = await processModel(r.request);
    return res.send(JSON.stringify(model,null,2));
  }
  return res.send({error:'query not correct'});
});

router.post('/scence',async function(req,res,next){
  let body = req.body;
  let servicecode = body.servicecode;
  let username = body.username;
  let scencename = body.scencename;
  let model = {
    username:username,
    servicecode:servicecode,
    scence:scencename,
    response:{},
    date:new Date(),
  };

  let query = {
    username:username,
    servicecode:servicecode,
    scence:scencename,
  };

  let rc = await DBHelper.db.collection('mockuser').findOne(query);
  if (rc === null) {
    let r = await DBHelper.db.collection('mockuser').insert(model);
    res.send({scenceId:rr.insertedIds});
  }
  else {
    res.send({scenceId:rc._id});
  }
});

router.get('/scenceList', async function(req, res, next) {
  let query = {
    servicecode:req.query.servicecode,
    username:req.query.username
  };
  let r = await DBHelper.db.collection('mockuser').find(query);
  let count = await r.count();
  let model = {services:[]};
  try{
    r.forEach((item)=>{
      let tmp = {
        _id : item._id,
        scence:item.scence,
      };
      model.services.push(tmp);
    },(e)=>{
      res.send(model,null,2);
    });
  }
  catch(e){
    res.send({error:"for each error"});
  }

});

router.get('/response/', async function(req, res, next) {
  try{
    let r = await DBHelper.db.collection('mockuser').findOne({'_id':ObjectID(req.query.scenceid)});
    res.send(r.response);
  }
  catch(e){
    res.send({error:e.message});
  }
});

router.get('/response/:servicecode', async function(req, res, next) {
  let r = await DBHelper.db.collection('service').findOne({'servicecode':req.params.servicecode});
  let model = await processModel(r.response);
  res.send(model);
});

async function processModel(res){
  let model = {};
  for (let o in res){
    switch(res[o].Metadata) {
      case "NullableClass": {
        let type = res[o].Type;
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