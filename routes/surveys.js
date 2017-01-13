var Router = require('express').Router;
var debug = require('debug')('surveyRouter');

var auth = require('../utils/auth');
var models = require('../models');
var Survey = models.Survey;
var Option = models.Option;


var router = new Router();

router
  .get('', auth.isAuthenticated, function (req, res) {
    var maxPerPage = 10;
    var page = req.query.page || 0;
    page = page === 0 ? 0 : page - 1;
    Survey.findAll({
      offset: page * maxPerPage,
      limit: maxPerPage,
      include: [Option]
    }).then(function (surveys) {
      res.json(surveys);
    });
  })
  .post('', auth.isAuthenticated, function (req, res) {
    if (!req.body.question_text || !req.body.Options) {
      res.json({ message: 'Invalid body' });
      return;
    }
    Survey.create({
      question_text: req.body.question_text
    }).then(function (survey) {
      req.body.Options.forEach(function (option) {
        Option.create({
          text: option.text,
          answer_count: 0
        }).then(function (option) {
          option.setSurvey(survey).then(function () {
            res.json({ message: 'Success!' });
          });
        });
      });
    });
  })
  .get('/count', auth.isAuthenticated, function (req, res) {
    Survey.count().then(function (surveyCount) {
      res.json({ count: surveyCount });
    });
  })
  .get('/random', function (req, res) {
    var surveysAnswered = req.session.surveysAnswered ?
      req.session.surveysAnswered.map(function (x) { return parseInt(x); }) : [];
    Survey.findAll({
      include: [Option]
    }).then(function (surveys) {
      var unansweredSurveys = surveys.filter(function (survey) {
        console.log(surveysAnswered);
        return !surveysAnswered.some(function (surveyId) {
          return survey.id === surveyId;
        });
      });
      debug('qUnanswered: ' + unansweredSurveys);
      var randomIdx = Math.round((Math.random() * (unansweredSurveys.length - 1)));
      debug('randomIdx: ' + randomIdx);
      res.json(unansweredSurveys[randomIdx]);
    });
  })
  .get('/:survey_id', auth.isAuthenticated, function (req, res) {
    Survey.find({
      where: { id: req.params.survey_id },
      include: [Option]
    }).then(function (survey) {
      res.json(survey);
    });
  })
  .put('/:survey_id', auth.isAuthenticated, function (req, res) {
    Survey.find({
      where: { id: req.params.survey_id },
      include: [Option]
    }).then(function (survey) {
      if (!survey) {
        res.json({ message: 'Survey does not exist.' });
        return;
      }
      if (req.body.question_text) {
        survey.updateAttributes({ question_text: req.body.question_text });
      }
      if (req.body.Options) {
        req.body.Options.forEach(function (sentOption) {
          Option.findOrCreate({
            where: { id: sentOption.id }, defaults: { answer_count: 0 }
          }).spread(function (option, newlyCreated) {
            if (newlyCreated) {
              option.setSurvey(survey);
            }
            option.updateAttributes({ text: sentOption.text });
          });
        });
      }
      res.json({ message: 'Success!' });
    });
  })
  .delete('/:survey_id', auth.isAuthenticated, function (req, res) {
    Survey.find({
      where: { id: req.params.survey_id },
      include: [Option]
    }).then(function (survey) {
      Option.destroy({
        where: { SurveyId: survey.id }
      }).then(function (affectedRows) {
        survey.destroy().then(function () {
          res.json({ message: 'Success!' });
        });
      });
    });
  });

module.exports = router;
