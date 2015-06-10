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
        $state.go('tab.test', { location: 'replace' });
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
                  $state.go('tab.test', { location: 'replace' });
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
    $state.go('login', { location: 'replace' });
  }
})

.controller('TestCtrl', function($rootScope, $scope, $state, $stateParams, $q, $ionicLoading, $ionicHistory, LoginFactory, TestsFactory) {
    console.log($state.current.name, '$state');

  var ideas = [];

  if ($scope.user === undefined) {
    init();
  }
  else if ($state.current.name == "tab.start-test") {
    console.log('TestCtrl tab.start-test');
    setupTest();
  }
  else if ($state.current.name == "tab.end-test") {
    setupEndTest();
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

  var readyText = ['Ready...', 'Ready...Go!'];
  var readyCount = 0;
  var readyTimer = null;

  function setReadyTimer() {
    if (readyCount === readyText.length) {
      clearInterval(readyTimer);
      startTest();
    }
    else {
      $ionicLoading.show({
        template: readyText[readyCount]
      });
      readyCount++;
    }
  }

  // Setup test
  function setupTest() {
    console.log('TestCtrl setupTest');

    // show loading screen
    $ionicLoading.show({
      template: 'Loading...'
    });

    $scope.countdownDuration = 120;
    // $scope.countdownDuration = 2;
    $rootScope.testRunning = true;
    $scope.test = null;
    $scope.idea = '';
    $scope.ideasCount = 0;
    ideas: []

    // load a random test
    TestsFactory.draw().then(function() {
      $scope.test = TestsFactory.getCurrentTest();

      readyTimer = setInterval(setReadyTimer, 600)
    });
  }

  // Setup end of test
  function setupEndTest() {
    LoginFactory.loadUser($scope.user.id).then(function(user) {
      console.log(user, 'reload user');
      $scope.user = user;
      var testIdea = $scope.user.tests[$scope.user.tests.length-1];
      $scope.test = TestsFactory.get(testIdea.testId);
      $scope.ideas = testIdea.ideas;
      $scope.ideasCount = testIdea.ideas.length;

      $ionicLoading.hide();
    });
  }

  // Start test
  function startTest() {
    $ionicLoading.hide();
    $scope.$broadcast('timer-start');
  }

  // Do a test
  $scope.doTest = function() {
    console.log('TestCtrl doTest');
    $state.go('tab.start-test', { location: 'replace', reload: true, inherit: false, notify: true });
  }

  // Save idea input
  $scope.enterIdea = function() {
    console.log($scope.idea);
    var idea = $scope.idea.replace(/\r\n/g, '');
    if (idea.length > 0) {
      ideas.push($scope.idea);
      $scope.ideasCount = ideas.length;
    }
    $scope.idea = null;
  }

  // End test
  $scope.endTest = function() {
    console.log(ideas, 'test ended');
    $rootScope.testRunning = false;
    // show saving screen
    $ionicLoading.show({
      template: 'Saving...'
    });

    TestsFactory.saveIdeas($scope.user.id, $scope.test.id, ideas).then(function () {
      $ionicHistory.clearHistory();
      $state.go('tab.end-test', { location: 'replace' });
    });
  }
})

.controller('TestDetailCtrl', function($scope, $stateParams, ResultsFactory) {
  $scope.result = ResultsFactory.get($stateParams.resultId);
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
