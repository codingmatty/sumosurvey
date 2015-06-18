
'use strict';

var checkLoggedin = function ($q, $timeout, $http, $location, $rootScope, AdminService) {
  // Initialize a new promise
  var deferred = $q.defer();

  // Make an AJAX call to check if the user is logged in
  $http.get('/loggedin').success(function (response) {
    // Authenticated
    if (response.authenticated)
      /*$timeout(deferred.resolve, 0);*/
      deferred.resolve();

    // Not Authenticated
    else {
      AdminService.setUrlAfterLogin($location.url());
      deferred.reject();
      $location.url('/login');
    }
  }).error(function (err) {
    AdminService.setUrlAfterLogin($location.url());
    deferred.reject();
    $location.url('/login');
  });

  return deferred.promise;
};

angular.module('SumoSurvey', [
  'ngCookies',
  'ngRoute',
  'ngTouch',
  'restangular'
])
  .config(['$routeProvider', '$locationProvider', '$httpProvider', 'RestangularProvider', function ($routeProvider, $locationProvider, $httpProvider, RestangularProvider) {
  $routeProvider
    .when('/', {
    templateUrl: 'partials/survey.html',
    // controller: 'SurveyController'
  })
    .when('/login', {
    templateUrl: 'partials/login.html',
    // controller: 'LoginController'
  })
    .when('/admin/list', {
    templateUrl: 'partials/list.html',
    // controller: 'AdminController',
    resolve: {
      loggedin: checkLoggedin
    }
  })
    .when('/admin/form/:survey_id?', {
    templateUrl: 'partials/form.html',
    // controller: 'FormController',
    resolve: {
      loggedin: checkLoggedin
    }
  })
    .otherwise({
    redirectTo: '/'
  });

  $locationProvider.html5Mode(true);

  RestangularProvider.setBaseUrl('/api/');
  RestangularProvider.setDefaultHeaders($httpProvider.defaults.headers);
  RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
    if (response.status === 401) {
      if (operation === 'getList') {
        return [];
      }
    }
    return data;
  });
}]);