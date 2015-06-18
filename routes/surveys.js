var models  = require('../models');
var express = require('express');
var router  = express.Router();
var auth = require('../auth');
var debug = require('debug')('surveyRouter');

router.get('', auth.isAuthenticated, function(req, res) {
  var maxPerPage = 10;
  var page = req.query.page || 0;
  page = page === 0 ? 0 : page-1;
  models.Survey.findAll({
    offset: page * maxPerPage, 
    limit: maxPerPage, 
    include: [models.Option]
  }).then(function(surveys) {
    res.json(surveys);
  });
});

router.post('', auth.isAuthenticated, function(req, res) {
  if (!req.body.question_text || !req.body.Options) {
    res.json({message: 'Invalid body'});
    return;
  }
  models.Survey.create({
    question_text: req.body.question_text
  }).then(function(survey) {
    req.body.Options.forEach(function(option){
      models.Option.create({
        text: option.text,
        answer_count: 0
      }).then(function(option){
        option.setSurvey(survey).then(function(){
          res.json({message: 'Success!'});
        });
      });
    });
  });
});

router.get('/count', auth.isAuthenticated, function(req, res) {
  models.Survey.findAll().then(function(surveys) {
    
    res.json({count: surveys.length});
  });
});

router.get('/random', function(req, res) {
  var questionsAnswered = req.cookies.questionsAnswered ? req.cookies.questionsAnswered.slice(1,-1).split(',').map(function(x) {return Number(x);}) : [];
  models.Survey.findAll({
    include: [models.Option]
  }).then(function(surveys) {
    var questionsUnanswered = surveys.filter(function(survey) {
      return !questionsAnswered.some(function(qAd) {return survey.id === qAd;});
    });
    debug('qUnanswered: ' + questionsUnanswered);
    var randomIdx = Math.round((Math.random() * (questionsUnanswered.length - 1)));
    debug('randomIdx: ' + randomIdx);
    res.json(questionsUnanswered[randomIdx]);
  });
});

router.get('/:survey_id', auth.isAuthenticated, function(req, res) {
  models.Survey.find({
    where: {id: req.params.survey_id},
    include: [models.Option]
  }).then(function(survey) {
    res.json(survey);
  });
});

function update(req, res) {
  models.Survey.find({
    where: {id: req.params.survey_id},
    include: [models.Option]
  }).then(function(survey) {
    if (!survey) {
      res.json({message: 'Survey does not exist.'});
      return;
    }
    if (req.body.question_text) {
      survey.updateAttributes({ question_text: req.body.question_text});
    }
    if (req.body.Options) {
      req.body.Options.forEach(function(sentOption){
        models.Option.findOrCreate({
          where: {id: sentOption.id}, defaults: {answer_count: 0}
        }).spread(function(option, newlyCreated){
          if (newlyCreated) {
            option.setSurvey(survey);
          }
          option.updateAttributes({text: sentOption.text});
        });
      });
    }
    res.json({message: 'Success!'});
  });
}
router.post('/:survey_id', auth.isAuthenticated, update);
router.put('/:survey_id', auth.isAuthenticated, update);

router.delete('/:survey_id', auth.isAuthenticated, function(req, res) {
  models.Survey.find({
    where: {id: req.params.survey_id},
    include: [models.Option]
  }).then(function(survey) {
    models.Option.destroy({
      where: {SurveyId: survey.id}
    }).then(function(affectedRows){
      survey.destroy().then(function(){
        res.json({message: 'Success!'});
      });
    });
  });
});

module.exports = router;