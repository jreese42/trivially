var express = require('express');
var router = express.Router();

var utils = require('../game/util.js')

/* GET home page. */
router.get('/:prefillGameCode', function(req, res, next) {
  if (utils.gameCodeIsValid(req.params.prefillGameCode))
    res.render('index', { title: 'Trivially', prefillGameCode: req.params.prefillGameCode });
  else
    res.render('index', { title: 'Trivially', gameCodeError: true }); //TODO
});

module.exports = router;
