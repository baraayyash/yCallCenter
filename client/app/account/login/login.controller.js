'use strict';

angular.module('yCallCenterApp')
  .controller('LoginCtrl', function ($scope, Auth, $location,$cookieStore,$rootScope) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      // if(form.$valid) {
      //   // $rootScope.loggedIn = 1;
      //   console.log($scope.user.email);
      //   $cookieStore.put('userEmail',$scope.user.email);
      //    $location.path("/");
      // }

            if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          $cookieStore.put('userEmail',$scope.user.email);
          $location.path('/');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }


    };




    $scope.logout = function(){$rootScope.loggedIn = 0;
       $cookieStore.remove('userEmail');
     $location.path("/login");
   };

  });
