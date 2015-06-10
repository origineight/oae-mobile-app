angular.module('oaeApp.controllers', [])

.controller('LoginCtrl', function($rootScope, $scope, $ionicPopup, $state, $ionicHistory, LoginFactory) {

  if ($rootScope.isLoggedIn === undefined || $rootScope.user == undefined) {
    init();
  }

  function init() {
    console.log('LoginCtrl init');
    $rootScope.isLoggedIn = false;

    LoginFactory.loadLastUser().then(function() {
      var lastUser = LoginFactory.getLastUser();
      console.log(lastUser, 'lastUser');
      $rootScope.user = lastUser;
    });
  }

  // Login scope
  $scope.login = function() {
    LoginFactory.loginUser($rootScope.user.email)
      .success(function(user) {
        $rootScope.isLoggedIn = true;
        $state.go('tab.test', { location: 'replace' });
      })
      .error(function(user) {
        var alertPopup = $ionicPopup.confirm({
          title: 'Create new profile?',
          template: 'We don\'t have a profile with "' + $rootScope.user.email + '".<br />Do you want to create new profile?'
        });
        alertPopup.then(function(res) {
          if (res) {
            console.log('Creating user');
            LoginFactory.createUser($rootScope.user.email).success(function(user) {
              LoginFactory.loginUser($rootScope.user.email)
                .success(function(user) {
                  $rootScope.isLoggedIn = true;
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
    $rootScope.isLoggedIn = false;
    $ionicHistory.clearHistory();
    $state.go('login', { location: 'replace' });
  }
})

.controller('TestCtrl', function($rootScope, $scope, $state, $stateParams, $q, $ionicLoading, $ionicHistory, LoginFactory, TestsFactory) {
    console.log($state.current.name, '$state');

  var ideas = [];

  if ($rootScope.isFirstTest === undefined) {
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

    $rootScope.isFirstTest = false;
    // $scope.user = LoginFactory.getLastUser();

    // number of tests current user has taken
    $scope.numTestsTaken = $rootScope.user.tests.length;
    if ($scope.numTestsTaken == 0) {
      $rootScope.isFirstTest = true;
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
    // $scope.countdownDuration = 10;
    $rootScope.testRunning = true;
    $scope.test = null;
    $scope.idea = '';
    $scope.ideasCount = 0;
    ideas: []

    // load a random test
    TestsFactory.draw().then(function() {
      $scope.test = TestsFactory.getCurrentTest();

      readyTimer = setInterval(setReadyTimer, 600);
    });
  }

  // Setup end of test
  function setupEndTest() {
    var testIdea = $rootScope.user.tests[$rootScope.user.tests.length-1];
    $scope.test = TestsFactory.get(testIdea.testId);
    $scope.ideas = testIdea.ideas;
    $scope.ideasCount = testIdea.ideas.length;

    $ionicLoading.hide();
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

    $rootScope.user.tests.push({
      testId: $scope.test.id,
      ideas: ideas
    })

    LoginFactory.updateUserTests($rootScope.user).then(function () {
      $ionicHistory.clearHistory();
      $state.go('tab.end-test', { location: 'replace' });
    });
  }
})

.controller('ResultsCtrl', function($rootScope, $scope, $ionicLoading, ResultsFactory) {
  console.log('ResultsCtrl init');

  init();

  function init() {
    console.log('ResultsCtrl init');

    // show loading screen
    $ionicLoading.show({
      template: 'Loading...'
    });

    // number of tests current user has taken
    $scope.numTestsTaken = $rootScope.user.tests.length;
    if ($scope.numTestsTaken == 0) {
      $scope.isFirstTest = true;
    }

    // load all results
    $scope.results = $rootScope.user.tests;

    Chart.defaults.global.colours = [
      { // blue
          fillColor: "rgba(56, 126, 245, 0.2)",
          strokeColor: "#387ef5",
          pointColor: "#387ef5",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(151,187,205,0.8)"
      },
      { // red
          fillColor: "rgba(247,70,74,0.2)",
          strokeColor: "rgba(247,70,74,1)",
          pointColor: "rgba(247,70,74,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(247,70,74,0.8)"
      }
    ];

    $scope.labels = [];
    // $scope.series = ['Tests'];
    $scope.data = [];
    var dataPoints = [];

    for (var i = $scope.results.length - 1; i >= 0; i--) {
      $scope.labels.push(i);
      dataPoints.push($scope.results[i].ideas.length);
    };
    $scope.data.push(dataPoints);

    // hide loading screen
    $ionicLoading.hide();
  }
})

.controller('ResultDetailCtrl', function($rootScope, $scope, $stateParams, TestsFactory, ResultsFactory) {

  $scope.result = null;
  var resultId = parseInt($stateParams.resultId);
  var results = $rootScope.user.tests;

  $scope.result = results[resultId];
  $scope.test = TestsFactory.get($scope.result.testId);
})

.controller('AboutCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
