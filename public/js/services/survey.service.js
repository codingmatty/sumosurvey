angular.module('SumoSurvey')
	.factory('SurveyService', ['Restangular',
		function (Restangular) {
			var SurveyService = {};

			SurveyService.getRandomSurvey = function (cb) {
				Restangular.all('surveys').doGET('random')
					.then(function (survey) {
						if (cb) cb(survey);
					}, function (response) {
						console.log('Error: ' + response);
					});
			};

			SurveyService.getSurveys = function (page, cb) {
				page = page || 1;
				Restangular.all('surveys').getList({ page: page })
					.then(function (surveys) {
						if (cb) cb(surveys);
					}, function (response) {
						console.log('Error: ' + response);
					});
			};

			SurveyService.getSurveyCount = function (cb) {
				Restangular.all('surveys').doGET('count').then(function (res) {
					if (cb) cb(res.count);
				});
			}

			SurveyService.updateOrCreateSurvey = function (survey, cb) {
				var promise;
				if (survey.id && survey.save) {
					promise = survey.save();
				} else if (survey.id) {
					promise = Restangular.one('surveys', survey.id).put(survey);
				} else {
					promise = Restangular.all('surveys').post(survey);
				}
				promise.then(function () {
					if (cb) cb();
				});
			};

			SurveyService.deleteSurvey = function (survey, cb) {
				var promise;
				if (survey.remove) {
					promise = survey.remove();
				} else {
					promise = Restangular.one('surveys', survey.id).remove();
				}
				promise.then(function () {
					if (cb) cb();
				});
			};

			return SurveyService;
		}]);
