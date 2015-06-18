angular.module('SumoSurvey').controller('FormController', ['AdminService', 'SurveyService', 'OptionService', '$routeParams', '$location', function (AdminService, SurveyService, OptionService, $routeParams, $location) {
	var formVm = this;
	
	if (!AdminService.LoggedIn()) {
		$location.url('/login');
	}
	
	formVm.survey = {
		question_text: '',
		Options: []
	};
	formVm.newOption = {
		text: ''
	};
	if ($routeParams.survey_id) {
		SurveyService.getSurvey($routeParams.survey_id, function(survey) {
			if (survey) {
				formVm.survey = survey;
			}
		});
	} else {
		formVm.survey = AdminService.getCurrentSurvey() || {
			question_text: '',
			Options: []
		};
	}
	
	formVm.addOption = function(option) {
		var newOption = {
			text: option.text || '',
			answer_count: 0
		}
		formVm.survey.Options.push(newOption);
		formVm.newOption.text = '';
	};
	
	var deletedOptions = [];
	
	formVm.removeOption = function(survey, option) {
		deletedOptions.push(option);
		survey.Options.splice(formVm.survey.Options.indexOf(option),1);
	};
	
	formVm.submitSurvey = function(survey) {
		if (!survey.Options || survey.Options.length < 1) {
			formVm.errorMessage = 'Survey must have at least one option to choose from.';
			return;
		}
		deletedOptions.forEach(function(option) {
			OptionService.deleteOption(option);
		});
		SurveyService.updateOrCreateSurvey(survey, function() {
			$location.url('/admin/list');
		});
	};
}]);