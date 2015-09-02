'use strict';

angular.module('yCallCenterApp')
  .config(function ($routeProvider) {
    $routeProvider
      // .when('/', {
      //   templateUrl: 'app/main/main.html',
      //   controller: 'MainCtrl'
      //         });
    .when('/', {

        resolve : {

            "check" : function($location,$rootScope){

                if(!$rootScope.loggedIn ){
                        $location.path("/login");
                    }
            }

        },
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'


        });
  });