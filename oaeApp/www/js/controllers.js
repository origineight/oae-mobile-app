angular.module('oaeApp.controllers', [])

.controller('LoginCtrl', function($scope, $ionicPopup, $state, $lfmo, LoginFactory) {

  init();

  function init() {
    var lastUser = {};

    LoginFactory.loadLastUser().then(function() {
      lastUser = LoginFactory.getLastUser();
      console.log(lastUser, 'lastUser');
      $scope.user = lastUser;
    });
  }

  $scope.login = function() {
    LoginFactory.loginUser($scope.user.email)
      .success(function(user) {
        $state.go('tab.test');
      })
      .error(function(user) {
        var alertPopup = $ionicPopup.confirm({
          title: 'Create new profile?',
          template: 'We don\'t have a profile with "' + $scope.user.email + '".<br />Do you want to create new profile?'
        });
        alertPopup.then(function(res) {
          if (res) {
            console.log('Creating user');
            LoginFactory.createUser($scope.user.email).success(function(user) {
              LoginFactory.loginUser($scope.user.email)
                .success(function(user) {
                  $state.go('tab.test');
                });
            })
          }
          else {
            console.log('Cancel, don\'t create user');
          }
        });
      });
  }
})

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
