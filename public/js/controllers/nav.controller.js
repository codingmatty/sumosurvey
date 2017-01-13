angular.module('SumoSurvey')
	.controller('NavController', ['AdminService', '$location',
		function (AdminService, $location) {
			var navVm = this;

			navVm.AdminLoggedIn = AdminService.LoggedIn;
			navVm.AdminLogIn = function () {
				$location.url('/login');
			}
			navVm.AdminLogOut = function () {
				AdminService.LogOut(function () {
					$location.url('/');
				});
			}
		}]);
