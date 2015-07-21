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
      $rootScope.isFirstTest = false;

      // number of tests current user has taken
      if ($rootScope.user.numTestsTaken == 0) {
        $rootScope.isFirstTest = true;
      }

      // observe the number of user tests has taken
      $rootScope.$watch('user.numTestsTaken', function() {
        if ($rootScope.user.numTestsTaken == 0) {
          $rootScope.isFirstTest = true;
        }
        else {
          $rootScope.isFirstTest = false;
        }
      });
    });
  }

  // Handle Android hardware back button
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    console.log('stateChangeStart');

    // Prevent test interuption from back button
    if ($rootScope.testRunning) {
      event.preventDefault();
    }
    // Logged in back logic
    if ($rootScope.isLoggedIn && toState.name == 'logintab.login') {
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });
      $state.go('tab.test');
    }
    // Login logic
    if (!$rootScope.isLoggedIn && toState.name.substring(0, 8) !== 'logintab') {
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });
      $state.go('logintab.login');
    }
  });

  // Login scope
  $scope.login = function() {
    LoginFactory.loginUser($rootScope.user.email)
      .success(function(user) {
        $rootScope.isLoggedIn = true;

        $ionicHistory.nextViewOptions({
          disableBack: true,
          historyRoot: true
        });
        $state.go('tab.test');
      })
      .error(function(user) {
        var confirmPopup = $ionicPopup.confirm({
          title: 'Create new profile?',
          template: 'We don\'t have a profile with "' + $rootScope.user.email + '".<br />Do you want to create new profile?'
        });
        confirmPopup.then(function(res) {
          if (res) {
            console.log('Creating user');
            LoginFactory.createUser($rootScope.user.email).success(function(user) {
              LoginFactory.loginUser($rootScope.user.email)
                .success(function(user) {
                  // update user scope
                  $rootScope.user = user;
                  $rootScope.isLoggedIn = true;

                  $ionicHistory.nextViewOptions({
                    disableBack: true,
                    historyRoot: true
                  });
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
    $rootScope.isLoggedIn = false;
    $ionicHistory.clearHistory();
    $ionicHistory.nextViewOptions({
      disableBack: true,
      historyRoot: true
    });

    $state.go('logintab.login');
  }
  // Go result scope
  $scope.goResult = function() {
    $ionicHistory.clearHistory();
    $ionicHistory.nextViewOptions({
      disableBack: true,
      historyRoot: true
    });
    if ($rootScope.isFirstTest) {
      var alertPopup = $ionicPopup.alert({
        // title: 'Take some test first!',
        template: 'Take some test first!'
      });
      alertPopup.then(function(res) {
        $state.go('tab.test');
      });
    }
    else {
      $state.go('tab.results');
    }
  }
})

.controller('TestCtrl', function($rootScope, $scope, $state, $stateParams, $q, $ionicLoading, $ionicHistory, $ionicPopup, LoginFactory, TestsFactory) {
    console.log($state.current.name, '$state');

  // list of ideas entered by user in a test
  var ideas = [];
  var readyText = ['Ready...', 'Ready...Go!'];
  var readyCount = 0;
  var readyTimer = null;

  if ($state.current.name == "tab.start-test") {
    console.log('TestCtrl tab.start-test');
    setupTest();
  }
  else if ($state.current.name == "tab.end-test") {
    setupEndTest();
  }

  // Loading countdown before start test
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
    ideas = [];

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
    // Start the test timer
    $scope.$broadcast('timer-start');
  }

  // Do a test
  $scope.doTest = function() {
    console.log('TestCtrl doTest');
    $ionicHistory.nextViewOptions({
      disableBack: true,
      historyRoot: true
    });
    $state.go('tab.start-test');
  }

  // Save idea input
  $scope.enterIdea = function() {
    // prevent race condition
    if ($rootScope.testRunning) {
      console.log($scope.idea);
      var idea = $scope.idea.replace(/\r\n/g, '');
      if (idea.length > 0) {
        ideas.push($scope.idea);
        $scope.ideasCount = ideas.length;
      }
      $scope.idea = null;
    }
  }

  // End test, called by end of timer
  $scope.endTest = function() {
    console.log(ideas, 'test ended');
    // show saving screen
    $ionicLoading.show({
      template: 'Saving...'
    });

    $rootScope.testRunning = false;

    $rootScope.user.numTestsTaken++;
    $rootScope.user.tests.push({
      id: $rootScope.user.numTestsTaken,
      date: Date.now(),
      testId: $scope.test.id,
      ideas: ideas
    })

    LoginFactory.updateUserTests($rootScope.user).then(function () {
      ideas = [];
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });
      $state.go('tab.end-test');
    });
  }
})

.controller('ResultsCtrl', function($rootScope, $scope, $state, $filter, $ionicLoading, $ionicHistory, $ionicPopup, ResultsFactory, LoginFactory, TestsFactory) {
  console.log('ResultsCtrl');

  init();

  function init() {
    console.log('ResultsCtrl init');

    // show loading screen
    $ionicLoading.show({
      template: 'Loading...'
    });

    // load all results
    var results = $rootScope.user.tests;
    $scope.results = results.sort(sortBy('id', true, parseInt));
    console.log($scope.results, 'sorted - $scope.results');

    // Chart color
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

    // Chart data
    $scope.labels = [];
    $scope.series = ['Number of ideas'];
    $scope.data = [];

    // pagination
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    // render first chart
    paginateChart();

    $scope.numPages = function() {
      return Math.ceil($scope.results.length / $scope.pageSize);
    };

    // $watch not working
    // $scope.$watch('currentPage + pageSize', paginateChart);
    $scope.nextPage = function() {
      $scope.currentPage = $scope.currentPage + 1;
      paginateChart();
    }
    $scope.prevPage = function() {
      $scope.currentPage = $scope.currentPage - 1;
      paginateChart();
    }

    // hide loading screen
    $ionicLoading.hide();
  }

  // Update chart based on paginated results
  function paginateChart() {
    console.log('paginateResults');
    console.log($scope.currentPage, '$scope.currentPage');
    console.log($scope.pageSize, '$scope.pageSize');
    var begin = $scope.currentPage * $scope.pageSize;
    var end = begin + $scope.pageSize;

    var filteredResults = $scope.results.slice(begin, end);
    console.log(begin, 'begin');
    console.log(end, 'end');
    console.log(filteredResults, 'filteredResults');

    var dataPoints = [];
    $scope.labels = [];
    $scope.data = [];

    for (var i = filteredResults.length - 1; i >= 0; i--) {
      $scope.labels.push($filter('date')(filteredResults[i].date, 'shortDate') + ' #' + filteredResults[i].id);
      dataPoints.push(filteredResults[i].ideas.length);
    };
    $scope.data.push(dataPoints);
  }

  // Helper function to sort by primer
  // e.g.
  // - Sort by price high to low
  // homes.sort(sort_by('price', true, parseInt));
  // - Sort by city, case-insensitive, A-Z
  // homes.sort(sort_by('city', false, function(a){return a.toUpperCase()}));
  function sortBy(field, reverse, primer) {
    var key = primer ?
    function(x) {return primer(x[field])} :
    function(x) {return x[field]};

    reverse = !reverse ? 1 : -1;

    return function (a, b) {
      return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
  }

  $scope.resetResults = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Reset all tests?',
      template: '<i class="icon ion-alert-circled"> This will remove all tests data you have completed so far!<br />Are you sure?'
    });
    confirmPopup.then(function(res) {
      if (res) {
        console.log('Reset all tests');
        $rootScope.user.tests = [];
        $rootScope.user.numTestsTaken = 0;
        LoginFactory.updateUserTests($rootScope.user).then(function () {
          $ionicHistory.clearHistory();
          $ionicHistory.nextViewOptions({
            disableBack: true,
            historyRoot: true
          });
          $state.go('tab.test');
        });
      }
      else {
        console.log('Cancel, don\'t reset tests');
      }
    });
  }

  $scope.resultPercentile = function(answers) {
    return TestsFactory.getPercentile(answers);
  }

})

.controller('ResultDetailCtrl', function($rootScope, $scope, $stateParams, TestsFactory, ResultsFactory) {

  $scope.result = null;
  var resultId = parseInt($stateParams.resultId);

  ResultsFactory.setResults($rootScope.user.tests);
  ResultsFactory.get(resultId).then(function(result) {
    console.log(result);
    $scope.result = result;
    $scope.test = TestsFactory.get($scope.result.testId);
    $scope.percentile = TestsFactory.getPercentile(result.ideas.length);
  });
});
