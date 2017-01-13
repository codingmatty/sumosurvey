angular.module('SumoSurvey')
	.controller('AdminController', ['AdminService', 'SurveyService', '$location',
		function (AdminService, SurveyService, $location) {
			var adminVm = this;

			adminVm.currentPage = 1;
			adminVm.numberOfPages = 1;
			adminVm.pages = [1];

			adminVm.surveys = [];
			adminVm.totalAnswers = 0;

			function setupSurveys() {
				SurveyService.getSurveys(adminVm.currentPage, function (surveys) {
					adminVm.surveys = surveys.slice();
					adminVm.surveys.forEach(function (survey) {
						survey.totalAnswers = survey.Options.reduce(function (sum, option) {
							return sum + option.answer_count;
						}, 0);
					});
				});
			}

			if (!AdminService.LoggedIn()) {
				$location.url('/login');
			} else {
				SurveyService.getSurveyCount(function (count) {
					adminVm.numberOfPages = Math.ceil(count / 10);
					adminVm.pages = Array.apply(null, Array(adminVm.numberOfPages)).map(function (_, i) { return i + 1; });
				});
				setupSurveys();
			}

			adminVm.goToPrevPage = function () {
				if (adminVm.currentPage > 1) {
					adminVm.currentPage--;
					setupSurveys();
				}
			};
			adminVm.goToNextPage = function () {
				if (adminVm.currentPage + 1 <= adminVm.numberOfPages) {
					adminVm.currentPage++;
					setupSurveys();
				}
			};
			adminVm.goToPage = function (page) {
				if (page <= adminVm.numberOfPages && page !== adminVm.currentPage) {
					adminVm.currentPage = page;
					setupSurveys();
				}
			};

			adminVm.newSurvey = function () {
				AdminService.setCurrentSurvey(null);
				$location.url('/admin/form');
			};

			var resultsActive = {};
			adminVm.toggleResults = function (id) {
				if (resultsActive[id] === undefined) {
					resultsActive[id] = true;
				} else {
					resultsActive[id] = !resultsActive[id];
				}
			};
			adminVm.collapseResultsClass = function (id) {
				return resultsActive[id] ? '' : 'collapse';
			};
			adminVm.activeButtonClass = function (id) {
				return resultsActive[id] ? 'active' : '';
			};

			adminVm.editSurvey = function (survey) {
				AdminService.setCurrentSurvey(survey);
				$location.url('/admin/form');
			};

			adminVm.deleteSurvey = function (survey) {
				if (confirm('Are you sure you want to delete this Survey Question?')) {
					SurveyService.deleteSurvey(survey, function () {
						adminVm.surveys.splice(adminVm.surveys.indexOf(survey), 1);
						SurveyService.getSurveyCount(function (count) {
							adminVm.numberOfPages = Math.ceil(count / 10);
							adminVm.pages = Array.apply(null, Array(adminVm.numberOfPages)).map(function (_, i) { return i + 1; });
						});
						setupSurveys();

					});
				}
			};

		}]);
