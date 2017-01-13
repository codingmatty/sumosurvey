angular.module('SumoSurvey')
	.factory('OptionService', ['Restangular',
		function (Restangular) {
			var OptionService = {};

			OptionService.answerOption = function (option, cb) {
				var promise;
				if (option.doPOST) {
					promise = option.doPOST({}, 'answer');
				} else {
					promise = Restangular.one('options', option.id).doPOST({}, 'answer');
				}
				promise.then(function () {
					if (cb) cb();
				});
			};

			OptionService.deleteOption = function (option, cb) {
				var promise;
				if (option.remove) {
					promise = option.remove();
				} else if (option.id) {
					promise = Restangular.one('options', option.id).remove();
				} else {
					if (cb) cb();
					return;
				}
				promise.then(function () {
					if (cb) cb();
				});
			};

			return OptionService;
		}]);
