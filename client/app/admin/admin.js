'use strict';

angular.module('yCallCenterApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/admin', {
        resolve : {
            'check' : function($location,$rootScope){

                if($rootScope.supervisor.role !== 'admin'){
                        $location.path('/');
                    }
            }
        },
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl'
      })
      .when('/admin/view', {
        resolve : {
            'check' : function($location,$rootScope){

                if($rootScope.supervisor.role !== 'admin'){
                        $location.path('/');
                    }
            }
        },
        templateUrl: 'app/admin/view/view.html',
        controller: 'ViewCtrl'
      });


  });