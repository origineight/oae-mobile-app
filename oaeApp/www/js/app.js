// OAE App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'oaeApp' is the name of this angular module (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'oaeApp.services' is found in services.js
// 'oaeApp.controllers' is found in controllers.js
angular.module('oaeApp', ['ionic', 'ngMessages', 'angular-lfmo', 'oaeApp.controllers', 'oaeApp.services'])

.run(function($ionicPlatform) {
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

  // login state
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })

  // setup an abstract state for the tabs directive
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
    views: {
      'tab-test': {
        templateUrl: 'templates/start-test.html',
        controller: 'TestCtrl'
      }
    }
  })

  .state('tab.results', {
    url: '/results',
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

  .state('tab.about', {
    url: '/about',
    views: {
      'tab-about': {
        templateUrl: 'templates/tab-about.html',
        // controller: 'AboutCtrl'
      }
    }
  })
  .state('tab.about-divergent', {
    url: '/about/divergent',
    views: {
      'tab-about': {
        templateUrl: 'templates/divergent-thinking.html',
        // controller: 'DivergentCtrl'
      }
    }
  })
  .state('tab.about-tos', {
    url: '/about/tos',
    views: {
      'tab-about': {
        templateUrl: 'templates/tos.html',
        // controller: 'TosCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
