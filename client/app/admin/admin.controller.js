'use strict';

angular.module('yCallCenterApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();
     $scope.errors = {};


    $scope.delete = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };

            $scope.creatUser = function(form) {
            $scope.submitted = true;
            // if($scope.users)
            if (form.$valid ) {
                Auth.createUser({
                        email: $scope.user.email,
                        password: $scope.user.password,
                        name: $scope.user.name
                    })
                    .then(function() {

                      $scope.users = User.query();
                      $scope.errors.other = 'done';

                    })
                    .catch(function(err) {
                      if(err.status = 422)
                        $scope.errors.other = "user exists";
                    });
            }

        };



  });
