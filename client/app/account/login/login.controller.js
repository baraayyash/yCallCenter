'use strict';

angular.module('yCallCenterApp')
  .controller('LoginCtrl', function ($scope, Auth, $location,$rootScope) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        $rootScope.loggedIn = 1;
        $location.path("/");
      }

    };

  });
