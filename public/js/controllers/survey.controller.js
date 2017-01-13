angular.module('SumoSurvey')
	.controller('SurveyController', ['SurveyService', 'OptionService',
		function (SurveyService, OptionService) {
			var surveyVm = this;
			surveyVm.currentQuestion = {};
			surveyVm.selectedOption;

			var fetchSurvey = function () {
				SurveyService.getRandomSurvey(function (survey) {
					surveyVm.currentQuestion = survey;
				});
			};
			fetchSurvey();

			surveyVm.submitAnswer = function (questionAnswered, answer) {
				OptionService.answerOption(answer, fetchSurvey);
			};
		}]);
