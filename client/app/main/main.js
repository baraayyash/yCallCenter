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

            "check" : function($location,$rootScope,$cookieStore){

                if(!$cookieStore.get('userEmail')){
                        $location.path("/login");
                        console.log("error");
                    }
            }
        },
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',

        });
  });