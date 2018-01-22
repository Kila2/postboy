export default function () {
  const exp = {};
  exp.login = (req, res) => {
    console.log(req.username);
    res.send('hello');
  };
  return exp;
}
