'use strict';

angular.module('yCallCenterApp')
  .controller('MainCtrl', function ($scope, $http, $q, $routeParams,$rootScope) {

          console.log("in the main : " + $rootScope.loggedIn);

            $scope.status = 'waiting';
            $scope.callStatus = 'going';
            // $scope.supervisor = $routeParams.id;
            $scope.supervisor = 1;
             var calltime = 0;
             var timerData = 0;
            var connection = 0;
            var connection;
            var flag = 0;



            var calls = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/calls/");

            $http.get('https://yamsafer-call.herokuapp.com/do').success(function (token) {
               Twilio.Device.setup(token);
               // console.log("token : " + token);

                         }); // Note: Should do error checking here.

        var getUser = function(udid) {
            var user = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/users/" + udid + "");
            var def = $q.defer();
            user.once('value', function(snap) {
                def.resolve(snap.val());
            });
            return def.promise;
        };

         var getMyCalls = function() {
            var def = $q.defer();
            calls.orderByChild('Time').on('value', function(snap) {
                var records = [];
                snap.forEach(function(ss) {

                    var v = ss.val();
                    v.lastTimeActive = new Date(v.lastTimeActive);
                    if (v.To == $scope.supervisor) {
                        records.push(v);
                    }
                });
                def.resolve(records);
            });
            return def.promise;
        };

         calls.on('child_changed', function(snap) {
                           getMyCalls().then(function(calls) {
                        $scope.calls = calls;
                    });
         });


        var call = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/calls/");
                  call.on('child_added', function(snap) {
                           getMyCalls().then(function(calls) {
                        $scope.calls = calls;
                    });
         });

           getMyCalls().then(function(calls) {
                        $scope.calls = calls;

                    });


      Twilio.Device.ready(function (device) {
       // $scope.status = "ready to kick!";
      });

      Twilio.Device.error(function (error) {
            $http.get('https://yamsafer-call.herokuapp.com/do').success(function (token) {
               Twilio.Device.setup(token);
                         }); // Note: Should do error checking here.
      });

      Twilio.Device.cancel(function (device) {

       $scope.status = 'waiting' ;
       if(flag)
       $scope.$apply();
      flag = 1;
      });

      Twilio.Device.connect(function (conn) {
        // $scope.status = "got a call";
        connection = conn;
      });

      Twilio.Device.disconnect(function (conn) {
        // $scope.status = "call ended"
          function n(num){
    return num> 9 ? "" + num: "0" + num;
}
        $scope.$broadcast('timer-stop');

        timerData = n(timerData.minutes)  + ":" + n(timerData.seconds);

      saveCall(connection,timerData);

        $scope.status = 'waiting';
      });


      /* Listen for incoming connections */
      Twilio.Device.incoming(function (conn) {

        if(!document.hasFocus()){
var notification = new Notification('New Call', {
      icon: 'http://iconizer.net/files/Bunch_of_Bluish_Icons/orig/call.png',
      body: "New call from : " + conn.parameters.From,
    });


    notification.onclick = function () {
     window.focus();
    };

}
        $scope.status = 'call';
        $scope.callStatus = 'incoming';
        $scope.loading = 1;
       connection = conn;
       getUser(conn.parameters.From).then(function(user) {
                        console.log(user);
                        $scope.user = user;
                        $scope.loading = 0;
                    });

      });

      $scope.accept = function(){connection.accept();$scope.callStatus = 'going' ;
      var time = new Date();

              calltime  = time.getFullYear() + '-' +
                        (((time.getMonth() + 1) < 10) ? ("0" + (time.getMonth() + 1)) : (time.getMonth() + 1)) + '-' + ((time.getDate() < 10) ? ("0" + time.getDate()) : time.getDate()) + " " +
                        time.getHours() + ':' +
                        ((time.getMinutes() < 10) ? ("0" + time.getMinutes()) : (time.getMinutes())) + ':' +
                        ((time.getSeconds() < 10) ? ("0" + time.getSeconds()) : (time.getSeconds()));
  };

  $scope.$on('timer-stopped', function (event, data){
                timerData = data;
            });

      $scope.hangUp = function(){

      connection.disconnect();

  };

      $scope.ignore = function(){flag=0; connection.ignore(); };

      $scope.isMute = function(){ return connection.isMuted() ;};

        $scope.block = function(udid,flag){
         var user = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/users/" + udid + "");
           if (flag)
                user.child('Blocked').set("blocked");
            else
                user.child('Blocked').set("unblocked");

            getUser(udid).then(function(user) {
                        $scope.user = user;
                    });
     };


     var saveCall = function(connection,timerData){

        var calls = new Firebase("https://dazzling-fire-5618.firebaseio.com/ios/calls/" );
                    calls.push({
                        From: connection.parameters.From,
                        To: "" + $scope.supervisor,
                        Time : "" + calltime,
                        Duration : timerData
                    });
     };


     $scope.muted = 'false';

      $scope.mute = function(){

       if( connection.isMuted() ){
        $scope.muted = 'false';
        connection.mute(false);}
     else{
      $scope.muted = 'true';
        connection.mute(true);
     }

      };



  });
