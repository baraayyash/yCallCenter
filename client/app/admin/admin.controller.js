'use strict';

angular.module('yCallCenterApp')
    .controller('AdminCtrl', function($scope, $http, Auth, User) {

        // Use the User $resource to fetch all users
        $scope.users = User.query();
        $scope.errors = {};
        //get the flag from heruko server
        $http.get('/api/calls/getFlag/1').success(function(flag) {
            if (flag){
                $scope.checkbox = true;
            }
            else{
                $scope.checkbox = false;
            }

        });

        $scope.delete = function(user) {
            User.remove({
                id: user._id
            });
            angular.forEach($scope.users, function(u, i) {
                if (u === user) {
                    $scope.users.splice(i, 1);
                }
            });
        };

        //set flag in the heruko server
        $scope.sendFlag = function(checkbox) {
            var id;
            if (checkbox){
                id = 1;
            }
            else{
                id = 0;
            }


            var request = $http({
                method: 'post',
                url: 'api/calls/setFlag/1',
                data: {
                    id: id,
                }
            });
            request.success(function() {
                console.log('sened');
            });

        };

        //create new user
        $scope.creatUser = function(form) {
            $scope.submitted = true;
            // if($scope.users)
            if (form.$valid) {
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
                        if (err.status === 422){
                            $scope.errors.other = 'user exists';
                        }
                    });
            }

        };



    });
