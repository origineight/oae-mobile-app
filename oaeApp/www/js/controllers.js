angular.module('oaeApp.controllers', [])

.controller('LoginCtrl', function($scope, $ionicPopup, $state, $lfmo, $ionicHistory, LoginFactory) {

  init();

  function init() {
    $scope.isLoggedIn = false;

    LoginFactory.loadLastUser().then(function() {
      var lastUser = LoginFactory.getLastUser();
      console.log(lastUser, 'lastUser');
      $scope.user = lastUser;
    });
  }

  // Login scope
  $scope.login = function() {
    LoginFactory.loginUser($scope.user.email)
      .success(function(user) {
        $scope.isLoggedIn = true;
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
                  $scope.isLoggedIn = true;
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

  // Logout scope
  $scope.logout = function() {
    $scope.isLoggedIn = false;
    $ionicHistory.clearHistory();
    $state.go('login');
  }
})

.controller('TestCtrl', function($scope) {})

.controller('ResultsCtrl', function($scope, Results) {
  $scope.results = Results.all();
  $scope.remove = function(result) {
    Results.remove(result);
  }
})

.controller('ResultDetailCtrl', function($scope, $stateParams, Results) {
  $scope.result = Results.get($stateParams.resultId);
})

.controller('AboutCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
