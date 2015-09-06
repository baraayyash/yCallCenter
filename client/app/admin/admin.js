'use strict';

angular.module('yCallCenterApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/admin', {
        resolve : {

            "check" : function($location,$rootScope,$cookieStore){

                if($rootScope.supervisor.role != 'admin'){
                        $location.path("/");
                    }
            }
        },
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl'
      });
  });