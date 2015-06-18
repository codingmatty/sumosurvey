var models  = require('../models');
var express = require('express');
var router  = express.Router();
var auth = require('../auth');

router.delete('/:option_id', auth.isAuthenticated, function (req, res) {
  models.Option.destroy({
    where: { id: req.params.option_id }
  }).then(function(affectedRows) {
    if (affectedRows) {
      res.json({message: 'Success!'});
    } else {
      res.json({message: 'Option did not exist.'});
    }
  });
});

router.post('/:option_id/answer', function (req, res) {
  models.Option.find({
    where: { id: req.params.option_id }
  }).then(function(option) {
    option.updateAttributes({ 
      answer_count: option.answer_count + 1 
    }).then(function() {
      res.json({message: 'Success!'});
    });
  });
});

module.exports = router;