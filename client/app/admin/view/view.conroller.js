'use strict';

angular.module('yCallCenterApp')
    .controller('ViewCtrl', function($scope, $http, Auth, User) {

    var
        nameList = ['Pierre', 'Pol', 'Jacques', 'Robert', 'Elisa'],
        familyName = ['Dupont', 'Germain', 'Delcourt', 'bjip', 'Menez'];

    function createRandomItem() {
        var
            firstName = nameList[Math.floor(Math.random() * 4)],
            lastName = familyName[Math.floor(Math.random() * 4)],
            age = Math.floor(Math.random() * 100),
            email = firstName + lastName + '@whatever.com',
            balance = Math.random() * 3000;

        return{
            firstNamee: firstName,
            lastNamee: lastName,
            agee: age,
            emaile: email,
            balancee: balance
        };
    }

    $scope.calls = [];
    $scope.rowCollection = [];


    $http.get('/api/calls').success(function(data) {
        $scope.calls =data;
        console.log($scope.calls[1]);
});

        $scope.itemsByPage=3;

    for (var j = 0; j < 10; j++) {
        $scope.rowCollection.push(createRandomItem());
    }

    console.log($scope.rowCollection[1]);


    });
