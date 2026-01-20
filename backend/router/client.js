const express = require('express');
const router = express.Router();
const clients = require('../controllers/clients');
const catchAsync = require('../helper/catchAsync');
const passport = require('passport');
const { loggedCheck } = require('../middleware');

router.post(
  '/register',
  catchAsync(clients.registerFormPost)
);

router.post(
  '/login',
  (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(400).json({ error: info.message || 'Login failed' });
      }
      req.logIn(user, err => {
        if (err) return next(err);
        res.json({
          message: `Welcome back, ${user.username}`,
          user: { id: user._id, username: user.username, email: user.email }
        });
      });
    })(req, res, next);
  }
);

router.post('/logout', loggedCheck, clients.logout);

router.get('/current', (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json(null);
  }

  const { _id, username, email } = req.user;

  res.json({
    _id,
    username,
    email
  });
});
module.exports = router;
