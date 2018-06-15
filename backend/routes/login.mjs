import * as DBHelper from '../lib/DBHelper';
import randomHexString from '../lib/Utils';
import express from "express";

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

  if (!user.password || user.password === '') {
    next(Error('password is required.'));
  }
  if ((typeof user.password !== 'string')
    || (user.username && typeof user.username !== 'string')) {
    next(Error('Invalid username/password.'));
  }
  let isValidPassword = false;
  (async function findUserAndUpdateToken() {
    try {
      const r = await DBHelper.db.collection('User').findOne({ username: user.username });
      if (r != null) {
        isValidPassword = r.password === user.password;
        if (isValidPassword === true) {
          user._id = r._id;
          user.token = randomHexString(32);
          res.cookie('postman-like', user.token, { expires: new Date(Date.now() + (1000 * 60 * 60 * 24)), httpOnly: true });
          await DBHelper.db.collection('User').updateOne({ _id: user._id }, { $set: { token: user.token } });
          delete user.password;
          res.json({
            rc: 0,
            user,
          });
        } else {
          next(Error('password is wrong'));
        }
      } else {
        next(Error('you shoud sign in first!'));
      }
    } catch (err) {
      next(err);
    }
  }());
});

export default router;
