angular.module('SumoSurvey').controller('SurveyController', ['SurveyService', 'OptionService', '$cookies', function(SurveyService, OptionService, $cookies) {
	var surveyVm = this;
	surveyVm.currentQuestion = {};
	surveyVm.selectedOption;
	
	var questionsAnswered = $cookies.getObject('questionsAnswered');
	if (!questionsAnswered) questionsAnswered = [];
	
	var fetchSurvey = function() {
		SurveyService.getRandomSurvey(function(survey) {
			surveyVm.currentQuestion = survey;
		});
	};
	fetchSurvey();
	
	surveyVm.submitAnswer = function(questionAnswered, answer) {
		OptionService.answerOption(answer, function() {
			questionsAnswered.push(questionAnswered.id);
			$cookies.remove('questionsAnswered');
			$cookies.putObject('questionsAnswered', questionsAnswered);
			
			fetchSurvey();
		});
	};
}]);