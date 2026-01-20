const Client = require('../types/client');

module.exports.registerFormPost = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new Client({ username, email });
    const newUser = await Client.register(user, password);

    req.login(newUser, err => {
      if (err) return next(err);
      res.status(201).json({
        message: 'Successfully signed up',
        user: { id: newUser._id, username: newUser.username, email: newUser.email }
      });
    });
  } catch (e) {
    res.status(400).json({ error: e.message || 'Something went wrong' });
  }
};

module.exports.loginFormPost = (req, res) => {
  const redirectUrl = res.locals.returnUrl || '/products';
  delete res.locals.returnUrl;
  res.json({
    message: `Welcome back, ${req.body.username}`,
    redirectUrl
  });
};

module.exports.logout = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.json({ message: 'Bye~ See you again!' });
  });
};
