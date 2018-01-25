export default function () {
  const exp = {};
  exp.login = (req, res) => {
    console.log(req.body.username);
    let rc = {
      login:2,
    };
    res.json(rc);
  };
  return exp;
}
