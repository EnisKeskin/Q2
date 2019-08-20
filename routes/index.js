module.exports = (io) => {

  const app = require('express');
  const router = app.Router();

  router.get('/', (req, res, next) => {
    res.render('index');
  });

  router.post('/', (req, res, next) => {
    if (req.body.pin)
      res.redirect('game?pin=' + req.body.pin);
    else
      res.redirect('/');
  });

  return router;
}