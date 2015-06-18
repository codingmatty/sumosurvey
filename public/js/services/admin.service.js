angular.module('SumoSurvey').factory('AdminService', ['Restangular', '$location', function(Restangular, $location) {
	var AdminService = {};
	
	var urlAfterLogin = '/admin/list';
	var loggedIn = false;
	var currentSurvey = null;
	
	AdminService.LoggedIn = function() {
		return loggedIn;
	};
	
	AdminService.LogIn = function(username, password, cb) {
		Restangular.all('admin').doPOST({
			username: username,
			password: password
		},'login').then(function(message) {
			console.log('Success: ' + message);
			loggedIn = true;
			if (cb) cb(true);
			else $location.url(urlAfterLogin);
		}, function(err) {
			console.log('Error: ' + err);
			loggedIn = false;
			if (cb) cb(false);
		});
	};
	
	AdminService.LogOut = function(cb) {
		Restangular.all('admin').doPOST({},'logout').then(function(message) {
			console.log('Success: ' + message);
			loggedIn = false;
			if (cb) cb(false);
			else $location.url(urlAfterLogin);
		}, function(err) {
			console.log('Error: ' + err);
			loggedIn = false;
			if (cb) cb(false);
		});
	};
	
	AdminService.setUrlAfterLogin = function(url) {
		urlAfterLogin = url;
	};
	AdminService.getUrlAfterLogin = function() {
		return urlAfterLogin;
	}
	
	AdminService.setCurrentSurvey = function(survey) {
		currentSurvey = survey;
	};
	
	AdminService.getCurrentSurvey = function() {
		return currentSurvey;
	}
	
	return AdminService;
}]);