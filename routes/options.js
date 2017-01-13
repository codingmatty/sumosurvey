var Router = require('express').Router;

var auth = require('../utils/auth');
var Option = require('../models').Option;


var router = new Router();

router
  .delete('/:option_id', auth.isAuthenticated, function (req, res) {
    Option.destroy({
      where: { id: req.params.option_id }
    }).then(function (affectedRows) {
      if (affectedRows) {
        res.json({ message: 'Success!' });
      } else {
        res.json({ message: 'Option did not exist.' });
      }
    });
  })
  .post('/:option_id/answer', function (req, res) {
    Option.find({
      where: { id: req.params.option_id }
    }).then(function (option) {
      option.updateAttributes({
        answer_count: option.answer_count + 1
      }).then(function () {
        var surveysAnswered = req.session.surveysAnswered;
        if (!surveysAnswered) {
          surveysAnswered = req.session.surveysAnswered = [];
        }
        surveysAnswered.push(option.SurveyId);
        res.json({ message: 'Success!' });
      });
    });
  });

module.exports = router;
