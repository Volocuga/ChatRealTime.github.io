angular.module('messages', [])
  .controller('messageFun', ['$http', '$scope', function ($http, $scope) {

    $scope.connect = function (channelName) {
      $http
        .get('http://localhost:1337/messages?where={"channelName":{"contains":"' + channelName + '"}}')
        .then(function (dataArray) {
          $scope.data[channelName] = dataArray.data;
        })

      io.socket.post('/on-connect', {
        channelName: channelName
      });
    }

    $scope.data = {
      it: [],
      sport: [],
      food: []
    };
//$scope.sportForm.userName = 'hello';
    $scope.sendMessage = function (channelName) {
      let form = document.getElementById(channelName);
      let data = {
        channelName: channelName,
        text: $scope.sportText,
        userName: $scope.sportText1
      };

      if (data.text || data.userName != null) {
        io.socket.post('/send', data);
        form.reset();
        $scope.sportText = null;
        $scope.sportText1 = null;
        $scope.foodText = null;
        $scope.foodText1 = null;
        $scope.itText = null;
        $scope.itText1 = null;
      } else{
         // $scope.sportText1.$dirty()
      }

    };



    io.socket.on('message', function (msg) {
      $scope.data[msg.channelName].push({
        userName: msg.userName,
        text: msg.text,
        id: msg.id
      });
      $scope.$digest();
    });

    $scope.deleteMessage = function (message, channelName) {
      io.socket.delete('/delete', {
        id: message.id,
        channelName: channelName
      });
    }

    io.socket.on('delete', function (msg) {
      let i = $scope.data[msg.channelName].findIndex(obj => obj.id === msg.id);
      $scope.data[msg.channelName].splice(i, 1);
      $scope.$digest();
    });

  }]);