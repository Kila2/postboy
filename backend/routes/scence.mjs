import express from 'express';
import DBHelper from '../lib/DBHelper';
import MongoDB from "mongodb";

const ObjectID = MongoDB.ObjectID;

const router = express.Router();

router.post('/', async function (req, res, next) {
  let body = req.body;
  let servicecode = body.servicecode;
  let username = body.username;
  let scencename = body.scencename;
  let model = {
    username: username,
    servicecode: servicecode,
    scence: scencename,
    response: {},
    date: new Date(),
  };

  let query = {
    username: username,
    servicecode: servicecode,
    scence: scencename,
  };

  let rc = await DBHelper.db.collection('scence').findOne(query);
  if (rc === null) {
    let r = await DBHelper.db.collection('scence').insert(model);
    res.send({scenceId: rr.insertedIds});
  }
  else {
    res.send({scenceId: rc._id});
  }
});

router.get('/', async function (req, res, next) {
  let query = {
    servicecode: req.query.servicecode,
    username: req.query.username
  };
  let r = await DBHelper.db.collection('scence').find(query);
  let count = await r.count();
  let model = {services: []};
  try {
    r.forEach((item) => {
      let tmp = {
        _id: item._id,
        scence: item.scence,
      };
      model.services.push(tmp);
    }, (e) => {
      res.send(model, null, 2);
    });
  }
  catch (e) {
    res.send({error: "for each error"});
  }

});

router.get('/:scenceid', async function (req, res, next) {
  try {
    let r = await DBHelper.db.collection('scence').findOne({'_id': ObjectID(req.params.scenceid)});
    res.send(r.response);
  }
  catch (e) {
    res.send({error: e.message});
  }
});

export default router;