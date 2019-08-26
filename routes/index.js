module.exports = (io) => {

  const app = require('express');
  const router = app.Router();

  router.get('/', (req, res, next) => {
    if (req.query.Message && req.query.Message != "")
      return res.render('index', { "Message": decodeURIComponent(req.query.message) });
    else
      return res.render('index');
  });

  router.post('/', (req, res, next) => {
    if (req.body.pin && req.body.pin != "")
      res.redirect('game?pin=' + req.body.pin);
    else
      res.redirect('/?Message=' + encodeURIComponent('Provide a Pin'));
  });

  return router;
}