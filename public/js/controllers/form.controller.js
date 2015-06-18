angular.module('SumoSurvey').controller('FormController', ['AdminService', 'SurveyService', 'OptionService', '$cookies', '$location', function (AdminService, SurveyService, OptionService, $cookies, $location) {
	var formVm = this;
	
	if (!AdminService.LoggedIn()) {
		$location.url('/login');
	}
	
	formVm.survey = AdminService.getCurrentSurvey() || {
		question_text: '',
		Options: []
	};
	formVm.newOption = {
		text: ''
	};
	
	
	formVm.addOption = function(option) {
		var newOption = {
			text: option.text || '',
			answer_count: 0
		}
		formVm.survey.Options.push(newOption);
		formVm.newOption.text = '';
	};
	
	formVm.removeOption = function(option) {
		if (confirm('Are you sure you want to delete this Survey Option?')) {
			OptionService.deleteOption(option, function() {
				formVm.survey.Options.splice(formVm.survey.Options.indexOf(option),1);
			});
		}
	};
	
	formVm.submitSurvey = function(survey) {
		if (!survey.Options || survey.Options.length < 1) {
			formVm.errorMessage = 'Survey must have at least one option to choose from.';
			return;
		}
		SurveyService.updateOrCreateSurvey(survey, function() {
			$location.url('/admin/list');
		});
	};
}]);