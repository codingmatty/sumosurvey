angular.module('SumoSurvey')
	.controller('LoginController', ['AdminService', '$location',
		function (AdminService, $location) {
			var loginVm = this;

			function resetForm(invalidLogin) {
				loginVm.message = invalidLogin ? 'Invalid Credentials. Try Again.' : '';
				loginVm.form = {
					username: '',
					password: ''
				};
			}
			resetForm();

			loginVm.submitLogin = function (form) {
				AdminService.LogIn(form.username, form.password, function (success) {
					if (success) $location.url(AdminService.getUrlAfterLogin());
					else resetForm(true);
				});
			}

		}]);
