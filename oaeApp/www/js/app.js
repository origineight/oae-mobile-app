// OAE App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'oaeApp' is the name of this angular module (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'oaeApp.services' is found in services.js
// 'oaeApp.controllers' is found in controllers.js
angular.module('oaeApp', ['ionic', 'ngMessages', 'angular-lfmo', 'timer', 'chart.js', 'oaeApp.controllers', 'oaeApp.services'])

.run(function($ionicPlatform, $ionicHistory, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
  // handle android back button
  $ionicPlatform.registerBackButtonAction(function (event) {
    console.log($ionicHistory, '$ionicHistory');
    console.log(event, 'event');
    console.log($rootScope, 'rootScope');
    if ($ionicHistory.currentStateName() == 'tab.test' || $ionicHistory.currentStateName() == 'logintab.login' || $ionicHistory.currentStateName() == 'tab.start-test' || $ionicHistory.currentStateName() == 'tab.end-test') {
      // ionic.Platform.exitApp();
      // or do nothing
      event.preventDefault();
      return false;
    }
    else {
      $ionicHistory.goBack();
    }
  }, 100);
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $compileProvider) {
  // disable debug info
  $compileProvider.debugInfoEnabled(false);

  // Enable native scrolling for Android
  var jsScrolling = (ionic.Platform.isAndroid() ) ? false : true;
  $ionicConfigProvider.scrolling.jsScrolling(jsScrolling);

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the Login tabs directive
  .state('logintab', {
    url: "/logintab",
    abstract: true,
    templateUrl: "templates/login-tabs.html"
  })

  // Each tab has its own nav history stack:
  // login state
  .state('logintab.login', {
    url: '/login',
    cache: false,
    views: {
      'logintab-login': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  })
  // about
  .state('logintab.about', {
    url: '/about',
    views: {
      'logintab-about': {
        templateUrl: 'templates/tab-about.html'
      }
    }
  })
  .state('logintab.about-divergent', {
    url: '/about/divergent',
    views: {
      'logintab-about': {
        templateUrl: 'templates/divergent-thinking.html'
      }
    }
  })
  .state('logintab.about-tos', {
    url: '/about/tos',
    views: {
      'logintab-about': {
        templateUrl: 'templates/tos.html'
      }
    }
  })

  // setup an abstract state for the Logged In tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html",
    controller: 'LoginCtrl'
  })

  // Each tab has its own nav history stack:
  .state('tab.test', {
    url: '/test',
    views: {
      'tab-test': {
        templateUrl: 'templates/tab-test.html',
        controller: 'TestCtrl'
      }
    }
  })
  .state('tab.start-test', {
    url: '/test/start',
    cache: false,
    views: {
      'tab-test': {
        templateUrl: 'templates/start-test.html',
        controller: 'TestCtrl'
      }
    }
  })
  .state('tab.end-test', {
    url: '/test/end/:testId',
    cache: false,
    views: {
      'tab-test': {
        templateUrl: 'templates/end-test.html',
        controller: 'TestCtrl'
      }
    }
  })

  .state('tab.results', {
    url: '/results',
    cache: false,
    views: {
      'tab-results': {
        templateUrl: 'templates/tab-results.html',
        controller: 'ResultsCtrl'
      }
    }
  })
  .state('tab.result-detail', {
    url: '/results/:resultId',
    views: {
      'tab-results': {
        templateUrl: 'templates/result-detail.html',
        controller: 'ResultDetailCtrl'
      }
    }
  })

  // about with different view
  .state('tab.about', {
    url: '/about',
    views: {
      'tab-about': {
        templateUrl: 'templates/tab-about.html'
      }
    }
  })
  .state('tab.about-divergent', {
    url: '/about/divergent',
    views: {
      'tab-about': {
        templateUrl: 'templates/divergent-thinking.html'
      }
    }
  })
  .state('tab.about-tos', {
    url: '/about/tos',
    views: {
      'tab-about': {
        templateUrl: 'templates/tos.html'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/logintab/login');

})

.filter('reverse', function() {
  return function(items) {
    if (items !== undefined) {
      return items.slice().reverse();
    }
    return null;
  };
})
.filter('startFrom', function() {
  return function(input, start) {
      start = +start; //parse to int
      return input.slice(start);
  }
});
