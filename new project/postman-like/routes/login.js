import * as DBHelper from '../lib/DBHelper';
import csrf from 'csurf';

import randomHexString from '../lib/Utils';

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('login', { title: 'Express' });
});
router.post('/', (req, res, next) => {
  const payload = req.body;
  const user = {};
  user.username = payload.username;
  user.password = payload.password;
  if (!user.username && !user.password) {
    next(Error('username/password is required.'));
  }

  if (!user.password) {
    next(Error('password is required.'));
  }
  if ((typeof user.password !== 'string')
    || (user.username && typeof user.username !== 'string')) {
    next(Error('Invalid username/password.'));
  }
  let isValidPassword = false;
  DBHelper.db.collection('User').findOne({ username: user.username }, (err, r) => {
    if (err != null) next(err);
    if (r != null) {
      isValidPassword = r.password === user.password;
      if (isValidPassword === true) {
        user._id = r._id;
        delete user.password;
        res.json({
          rc: 0,
          user,
        });
      } else {
        next(Error('password is wrong'));
      }
    }
  });
});

module.exports = router;
