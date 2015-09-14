'use strict';

angular.module('yCallCenterApp')
  .controller('MainCtrl', function ($scope,$cookieStore, $http, $q, $routeParams,$rootScope) {

$scope.status = 'waiting';
$scope.callStatus = 'going';
$scope.supervisorStatus = 'Available';
var calltime = 0;
var timerData = 0;
var flag = 1;
var connection = 0;
$scope.queue =0;

var socket = io.connect('http://localhost:9000');

socket.on('timeline', function(data) {
            var notification = new Notification('New Call', {
            icon: 'http://iconizer.net/files/Bunch_of_Bluish_Icons/orig/call.png',
            body: 'you have : ' + data + ' calls waiting ',
        });

        notification.onclick = function() {
            window.focus();
            $scope.status = 'call';
$scope.callStatus = 'going';
var connection = Twilio.Device.connect();
 calltime =  Date.now();
 $scope.$apply();
        };

    $scope.queue = data;
    $scope.$apply();
});




//token to setup the connection
$http.get('/api/calls/token/1').success(function(token) {
    Twilio.Device.setup(token);
});

//check how many calls in the queue
$http.get('/api/calls/getQueue/1').success(function(data) {
    $scope.queue = data.body;
});

// calls for the supervisor
$http.get('/api/calls/supervisor/' + $rootScope.supervisor._id+ '').success(function(calls) {
    $scope.calls = calls;
});

// Twilio.Device.ready(function(device) {
//     // $scope.status = 'ready to kick!';
// });

// reconnect with new token
Twilio.Device.error(function() {
$http.get('/api/calls/token/1').success(function(token) {
    Twilio.Device.setup(token);
});
});

// if the mobile user canceled the call
Twilio.Device.cancel(function(conn) {
    console.log(conn);
    $scope.status = 'waiting';
    if (flag)
        $scope.$apply();
    flag = 1;
});

//accept the call
Twilio.Device.connect(function(conn) {
    // $scope.status = 'got a call';
    connection = conn;
    connection.sid = $rootScope.supervisor._id;
});

// close the connection
Twilio.Device.disconnect(function() {

    function n(num) {
        return num > 9 ? '' + num : '0' + num;
    }
    $scope.$broadcast('timer-stop');

    timerData = n(timerData.minutes) + ':' + n(timerData.seconds);

    saveCall(connection, timerData);

    $scope.status = 'waiting';


//check how many calls in the queue
$http.get('/api/calls/getQueue/1').success(function(data) {
    $scope.queue = data.body;
});

});


/* Listen for incoming connections */
Twilio.Device.incoming(function(conn) {


    if($scope.supervisorStatus !== 'Available'){
       return conn.ignore();
    }

    if (!document.hasFocus()) {
        var notification = new Notification('New Call', {
            icon: 'http://iconizer.net/files/Bunch_of_Bluish_Icons/orig/call.png',
            body: 'New call from : ' + conn.parameters.From,
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

};

$scope.$on('timer-stopped', function(event, data) {
    timerData = data;
});

$scope.hangUp = function() {

    connection.disconnect();

};

$scope.catchCall = function(){

//       $http.get('/api/calls/test/1').success(function(token) {
//     // Twilio.Device.setup(token);
// });
$scope.status = 'call';
$scope.callStatus = 'going';

var connection = Twilio.Device.connect();
 calltime =  Date.now();

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
        method: 'post',
        url: 'api/calls',
        data: {
            user: connection.parameters.From,
            duration: timerData,
            supervisor: $rootScope.supervisor._id,
            time: calltime
        }
    });
    request.success(function() {
        $http.get('/api/calls/supervisor/' +$rootScope.supervisor._id+ '').success(function(calls) {
            $scope.calls = calls;
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
