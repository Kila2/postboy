function routes() {
  const exp = {};
  exp.login = (req, res) => {
    console.log(req.username);
  };
  return exp;
}
export {
  routes as loginRoute,
};
