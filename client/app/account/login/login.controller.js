'use strict';

angular.module('yCallCenterApp')
    .controller('LoginCtrl', function($scope, Auth, $location, $cookieStore, $rootScope) {
        $scope.user = {};
        $scope.errors = {};

        $scope.login = function(form) {
            $scope.submitted = true;

            if (form.$valid) {
                Auth.login({
                        email: $scope.user.email,
                        password: $scope.user.password
                    })
                    .then(function() {

                        Auth.getCurrentUser().$promise.then(function(res) {
                            $cookieStore.put('currentSupervisor', res);
                            $rootScope.supervisor = res;
                            $location.path('/');
                        });

                    })
                    .catch(function(err) {
                        $scope.errors.other = err.message;
                    });
            }

        };

        $scope.logout = function() {
            $cookieStore.remove('currentSupervisor');
            Auth.logout();
            $location.path("/login");
            $rootScope.supervisor = 0;
        };

    });
