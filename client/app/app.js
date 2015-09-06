'use strict';

angular.module('yCallCenterApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'ngtimeago',
  'timer'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
    $httpProvider.withCredentials = true;
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })
.run(function($rootScope, $location, $cookieStore, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function(event, next) {

        if ($cookieStore.get('currentSupervisor') ) {
              $rootScope.supervisor = $cookieStore.get('currentSupervisor');
              $location.path(next.$$route.originalPath);
        }

          Auth.isLoggedInAsync(function(loggedIn){
            if (next.authenticate || !loggedIn) {
              $cookieStore.remove('currentSupervisor');
              $location.path('/login');
            }
          });

        if (!$cookieStore.get('currentSupervisor') ) {
            $location.path("/login");
        }

        if ($cookieStore.get('currentSupervisor') && next.$$route.originalPath =="/login" ) {
            $location.path("/");
        }
    });
});
