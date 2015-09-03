'use strict';

angular.module('yCallCenterApp')
  .controller('MainCtrl', function ($scope,$cookieStore, $http, $q, $routeParams,$rootScope,$timeout) {

$scope.status = 'waiting';
$scope.callStatus = 'going';
// $scope.supervisor = $routeParams.id;
$scope.supervisor = 1;
var calltime = 0;
var timerData = 0;
var connection = 0;
var connection;
var flag = 0;

console.log($cookieStore.get('userEmail'));
// $timeout(function(){
// $http.get('https://yamsafer-call.herokuapp.com/do').success(function(token) {
//     Twilio.Device.setup(token);
// });
// },1000);



$http.get('/api/calls/token/1').success(function(token) {
    Twilio.Device.setup(token);
    console.log(token);
});


$http.get('/api/calls/supervisor/' + $scope.supervisor + '').success(function(calls) {
    $scope.calls = calls;
    console.log(calls);
});

Twilio.Device.ready(function(device) {
    // $scope.status = "ready to kick!";
});

Twilio.Device.error(function(error) {
    $http.get('https://yamsafer-call.herokuapp.com/do').success(function(token) {
        Twilio.Device.setup(token);
    }); // Note: Should do error checking here.
});

Twilio.Device.cancel(function(device) {

    $scope.status = 'waiting';
    if (flag)
        $scope.$apply();
    flag = 1;
});

Twilio.Device.connect(function(conn) {
    // $scope.status = "got a call";
    connection = conn;
});

Twilio.Device.disconnect(function(conn) {
    // $scope.status = "call ended"
    function n(num) {
        return num > 9 ? "" + num : "0" + num;
    }
    $scope.$broadcast('timer-stop');

    timerData = n(timerData.minutes) + ":" + n(timerData.seconds);

    saveCall(connection, timerData);

    $scope.status = 'waiting';
});


/* Listen for incoming connections */
Twilio.Device.incoming(function(conn) {

    if (!document.hasFocus()) {
        var notification = new Notification('New Call', {
            icon: 'http://iconizer.net/files/Bunch_of_Bluish_Icons/orig/call.png',
            body: "New call from : " + conn.parameters.From,
        });

        notification.onclick = function() {
            window.focus();
        };

    }
    $scope.status = 'call';
    $scope.callStatus = 'incoming';
    connection = conn;
    $scope.userUDID = conn.parameters.From;

    $scope.$apply();
});

$scope.accept = function() {
    connection.accept();
    $scope.callStatus = 'going';
    var time = new Date();

    calltime = time.getFullYear() + '-' +
        (((time.getMonth() + 1) < 10) ? ("0" + (time.getMonth() + 1)) : (time.getMonth() + 1)) + '-' + ((time.getDate() < 10) ? ("0" + time.getDate()) : time.getDate()) + " " +
        time.getHours() + ':' +
        ((time.getMinutes() < 10) ? ("0" + time.getMinutes()) : (time.getMinutes())) + ':' +
        ((time.getSeconds() < 10) ? ("0" + time.getSeconds()) : (time.getSeconds()));
};

$scope.$on('timer-stopped', function(event, data) {
    timerData = data;
});

$scope.hangUp = function() {

    connection.disconnect();

};

$scope.ignore = function() {
    flag = 0;
    connection.ignore();
};

$scope.isMute = function() {
    return connection.isMuted();
};

var saveCall = function(connection, timerData) {

    var request = $http({
        method: "post",
        url: "api/calls",
        data: {
            user: connection.parameters.From,
            duration: timerData,
            supervisor: $scope.supervisor,
            time: calltime
        }
    });

    request.success(function() {
        $http.get('/api/calls/supervisor/' + $scope.supervisor + '').success(function(calls) {
            $scope.calls = calls;
            console.log(calls);
        });
    });
};


$scope.muted = 'false';

$scope.mute = function() {
    if (connection.isMuted()) {
        $scope.muted = 'false';
        connection.mute(false);
    } else {
        $scope.muted = 'true';
        connection.mute(true);
    }
};



  });
