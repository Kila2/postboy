import express from "express";

let router = express.Router();

/* GET users listing. */
router.get('/MockServer/appserver', function(req, res, next) {
  var pathStr = path.join('public','response',req.param('servicecode')+'.txt');
  fs.readFile(pathStr,'utf-8',function (err,data) {
    if(err){
      res.send('');
    }
    else {
      res.send(data);
    }
  });
});

export default router;


