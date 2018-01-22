export default function () {
  const exp = {};
  exp.login = (req, res) => {
    console.log(req.body.username);
    let rc = {
      login:1,
    };
    res.json(rc);
  };
  return exp;
}
