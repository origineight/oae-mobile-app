angular.module('oaeApp.controllers', [])

.controller('LoginCtrl', function($scope, $ionicPopup, $state, $ionicHistory, LoginFactory) {

  if ($scope.isLoggedIn === undefined || $scope.user == undefined) {
    init();
  }

  function init() {
    console.log('LoginCtrl init');
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

.controller('TestCtrl', function($scope, $state, LoginFactory, TestsFactory) {
    console.log($state.current.name, '$state');
  if ($scope.user === undefined) {
    init();
  }
  else if ($state.current.name == "tab.start-test") {
    // @TODO:
    // - show loading
    // - hide loading when donw
    // - countdown timer
    //   - stop test when time's up
    // - run test
    //   - save ideas
    // - hide back button
    // - stop test
    //   - save user ideas
    //   - calculate percentile
    //   - redirect to end test page
    setupTest();
  }

  function init() {
    console.log('TestCtrl init');

    $scope.isFirstTest = false;
    $scope.user = LoginFactory.getLastUser();

    // number of tests current user has taken
    $scope.numTestsTaken = $scope.user.tests.length;
    if ($scope.numTestsTaken == 0) {
      $scope.isFirstTest = true;
    }
  }

  // Setup test
  function setupTest() {
    $scope.test = TestsFactory.draw();
    $scope.runTest = {
      ideaCount: 0,
      ideas: {}
    }
  }

  // Start test
  $scope.startTest = function() {
    // $scope.test = TestsFactory.draw();
    // $scope.runTest = {
    //   ideaCount: 0,
    //   ideas: {}
    // }
    $state.go('tab.start-test');
  }
})

.controller('ResultsCtrl', function($scope, ResultsFactory) {
  console.log('ResultsCtrl init');
  $scope.results = ResultsFactory.all();
  $scope.remove = function(result) {
    ResultsFactory.remove(result);
  }
})

.controller('ResultDetailCtrl', function($scope, $stateParams, ResultsFactory) {
  $scope.result = ResultsFactory.get($stateParams.resultId);
})

.controller('AboutCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
