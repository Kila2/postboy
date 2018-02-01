let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});
router.post('/', function(req, res, next) {
  // let payload = req.body;
  // let user = new User();
  // user.username = payload.username;
  // user.password = payload.password;
  // if (!user.username && !user.password) {
  //   throw new Error('username/password is required.');
  // }
  //
  // if (!user.password) {
  //   throw new Error('password is required.');
  // }
  // if (typeof user.password !== 'string'
  //   || user.username && typeof user.username !== 'string') {
  //   throw new Error('Invalid username/password.');
  // }
  //
  // let isValidPassword = false;
  // let query = new Query(User);
  // query.equalTo('username', user.username);
  // DBHelper.instance.find(query, function (err, r) {
  //   if (err != null) next(err);
  //   if (r != null) {
  //     isValidPassword = r.password === user.password;
  //     if (isValidPassword === true) {
  //       user.token = randomHexString(32);
  //       user._id = r._id;
  //       user.save(function (err, rs) {
  //         if (err != null) throw err;
  //         user.removeHiddenProperties(user);
  //         res.json({
  //           rc:0,
  //           user:user,
  //         });
  //       });
  //     }
  //     else {
  //       throw new Error('password is wrong');
  //     }
  //   }
  // });
});

module.exports = router;