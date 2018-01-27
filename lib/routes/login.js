import User from '../model/user';
import { DBHelper, Query } from  '../dbhelper';
import { randomHexString } from '../utils';

export default function () {
  const exp = {};
  exp.login = (req, res, next) => {
    let payload = req.body;
    let user = new User();
    user.name = payload.username;
    user.password = payload.password;
    if (!user.username && !user.password) {
      next(new Error('username/password is required.'));
    }

    if (!user.password) {
      next(new Error('password is required.'));
    }
    if (typeof user.password !== 'string'
        || user.username && typeof user.username !== 'string') {
      next(Error('Invalid username/password.'));
    }

    let isValidPassword = false;
    let query = new Query(User);
    query.equalTo('username', user.name);
    DBHelper.instance.find(query, function (err, r) {
      if (err != null) next(err);
      if (r != null) {
        isValidPassword = r.password === user.password;
        if (isValidPassword === true) {
          user.token = randomHexString(32);
        }
        else {
          next(new Error('password is wrong'));
        }
        let rc = {
          rc:0,
          user:user,
        };
        res.json(rc);
      }
    });
  };
  return exp;
}
