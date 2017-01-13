var bcrypt = require('bcrypt');
var debug = require('debug')('seed');
var seedData = require('../seed.json');

var models = require('../models');
var Admin = models.Admin;
var Survey = models.Survey;
var Option = models.Option;

module.exports = function seed() {
  debug('Seeding Admin Password');
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(seedData.admin_password, salt, function(err, hash) {
      Admin.findOrCreate({
        where: { username: 'admin' },
        defaults: {
          username: 'admin',
          password: hash
        }
      }).spread(function (admin, created) {
        if (!created) {
          admin.updateAttributes({ password: hash });
        }
      });
    });
  });

  debug('Seeding Survey Data');
  Survey.count().then(function (surveyCount) {
    debug('Survey Count: ' + surveyCount);
    if (surveyCount === 0) {
      addSurveys();
    }
  });
}

function addSurveys() {
  seedData.surveys.forEach(function (surveyToCreate) {
    Survey.create({
      question_text: surveyToCreate.question_text
    }).then(function (createdSurvey) {
      debug('Creating surveys...');
      surveyToCreate.options.forEach(function (optionText) {
        createOption(createdSurvey, optionText);
      });
    });
  });
}

function createOption(survey, optionText) {
  Option.create({
    text: optionText,
    answer_count: 0
  }).then(function (createdOption) {
    createdOption.setSurvey(survey).then(function () {
      debug('Seed Survey Question Created.');
    });
  });
}
