angular.module('SumoSurvey').controller('LoginController', ['AdminService', '$cookies', '$location', function (AdminService, $cookies, $location) {
	var loginVm = this;
	
	function resetForm() {
		loginVm.form = {
			username: '',
			password: ''
		};
	}
	resetForm();
	
	loginVm.submitLogin = function(form) {
		AdminService.LogIn(form.username, form.password, function(success) {
			if (success) $location.url(AdminService.getUrlAfterLogin());
			else resetForm();
		});
	}
	
}]);