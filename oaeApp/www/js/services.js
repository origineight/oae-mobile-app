angular.module('oaeApp.services', [])

.factory('LoginFactory', function($q, $filter, $lfmo) {
  var service = {};
  var lastUser = {};
  // var users = {};

  var users = $lfmo.define('users');

  // if there are no users create some
  // users.findAll().then(function (items) {
  //   if (items.length === 0) {
  //     users.create({
  //       email: 'ck@origineight.net',
  //       tests: [],
  //       lastAccess: Date.now()
  //     });
  //   }
  // });

  service.loadLastUser = function() {
    var deferred = $q.defer();

    users.findAll().then(function (user) {
      console.log(user, 'lastUser loaded');

      var filtered = $filter('orderBy')(user, 'lastAccess');
      console.log(filtered, 'filtered ordered');
      filtered = $filter('limitTo')(filtered, 1);
      console.log(filtered, 'filtered first item');

      if (filtered.length > 0) {
        lastUser = filtered[0];
      }
      deferred.resolve();
    });

    return deferred.promise;
  }

  service.getLastUser = function() {
    return lastUser;
  }

  service.loadUser = function(userId) {
    var deferred = $q.defer();

    users.get(userId).then(function (user) {
      deferred.resolve(user);
      // return user;
    });

    return deferred.promise;
  }

  service.loginUser = function(emailEntered) {
    var deferred = $q.defer();
    var promise = deferred.promise;

    users.findAll({ email: emailEntered }).then(function (user) {
      if (user.length > 0) {
        // user found
        lastUser = user[0];
        console.log(lastUser, 'current user');

        // update lastAccess
        users.update(lastUser.id, { lastAccess: Date.now() }).then(function (user) {
          users.get(lastUser.id).then(function (user) {
            lastUser = user;
            console.log(lastUser, 'current user updated lastAccess');
            deferred.resolve(user);
          });
        });

      }
      else {
        deferred.reject('Email not found.');
      }
    });
    promise.success = function(fn) {
      promise.then(fn);
      return promise;
    }
    promise.error = function(fn) {
      promise.then(null, fn);
      return promise;
    }
    return promise;
  }

  service.createUser = function(emailEntered) {
    var deferred = $q.defer();
    var promise = deferred.promise;

    users.findAll({ email: emailEntered }).then(function (user) {
      // email exist
      if (user.length > 0) {
        deferred.reject('Email already exist.');
      }
      else {
        // create the user
        users.create({
          email: emailEntered,
          numTestsTaken: 0,
          tests: []
        }).then(function (user) {
          console.log(user, 'user created');
          deferred.resolve(user);
        })
      }
    });
    promise.success = function(fn) {
      promise.then(fn);
      return promise;
    }
    promise.error = function(fn) {
      promise.then(null, fn);
      return promise;
    }
    return promise;
  }

  service.updateUserTests = function(updatedUser) {
    var deferred = $q.defer();

    users.get(updatedUser.id).then(function (user) {
      users.update(updatedUser.id, {numTestsTaken: updatedUser.numTestsTaken, tests: updatedUser.tests}).then(function (user) {
        console.log(user, 'ideas saved');
        deferred.resolve();
      });
    });

    return deferred.promise;
  }

  return service;
})

.factory('TestsFactory', function($q, $lfmo) {
  var service = {};

  var tests = [{
    id: 0,
    image: 'img/tests/Batteries.jpg',
    alt: 'Batteries'
  }, {
    id: 1,
    image: 'img/tests/BentWrench.jpg',
    alt: 'Crescent wrench bent'
  }, {
    id: 2,
    image: 'img/tests/BinderClips.jpg',
    alt: 'Binder Clips'
  }, {
    id: 3,
    image: 'img/tests/BottleCaps.jpg',
    alt: 'Plastic bottle caps'
  }, {
    id: 4,
    image: 'img/tests/BusinessCards.jpg',
    alt: 'Business cards'
  }, {
    id: 5,
    image: 'img/tests/CellophaneTape.jpg',
    alt: 'Cellophane tape in dispenser'
  }, {
    id: 6,
    image: 'img/tests/ClothespinApart.jpg',
    alt: 'Wooden clothespin'
  }, {
    id: 7,
    image: 'img/tests/Coins.jpg',
    alt: 'Coins, pennies'
  }, {
    id: 8,
    image: 'img/tests/Erasers.jpg',
    alt: 'Erasers for mechanical pencils'
  }, {
    id: 9,
    image: 'img/tests/NailTrimmer.jpg',
    alt: 'Nail trimmer'
  }, {
    id: 10,
    image: 'img/tests/PaperClips.jpg',
    alt: 'Paper clips'
  }, {
    id: 11,
    image: 'img/tests/PastaInBox.jpg',
    alt: 'Pasta mostly in the box'
  }, {
    id: 12,
    image: 'img/tests/PlasticForks.jpg',
    alt: 'Plastic forks'
  }, {
    id: 13,
    image: 'img/tests/PlasticSpoolwHand.jpg',
    alt: 'Plastic spool from roll of paper'
  }, {
    id: 14,
    image: 'img/tests/PlayingCards.jpg',
    alt: 'Playing cards'
  }, {
    id: 15,
    image: 'img/tests/RubberBands.jpg',
    alt: 'Rubber Bands'
  }, {
    id: 16,
    image: 'img/tests/Scissors.jpg',
    alt: 'Scissors'
  }, {
    id: 17,
    image: 'img/tests/TinCan.jpg',
    alt: 'Tin can'
  }, {
    id: 18,
    image: 'img/tests/WoodenPencils.jpg',
    alt: 'Wooden pencils'
  }, {
    id: 19,
    image: 'img/tests/YellowCurlyThing.jpg',
    alt: 'Yellow curly thing'
  }];

  var percentile = [{
    answers: 1,
    rank: '1',
  }, {
    answers: 2,
    rank: '2',
  }, {
    answers: 3,
    rank: '8',
  }, {
    answers: 4,
    rank: '12',
  }, {
    answers: 5,
    rank: '21',
  }, {
    answers: 6,
    rank: '30',
  }, {
    answers: 7,
    rank: '43',
  }, {
    answers: 8,
    rank: '54',
  }, {
    answers: 9,
    rank: '67',
  }, {
    answers: 10,
    rank: '74',
  }, {
    answers: 11,
    rank: '81',
  }, {
    answers: 12,
    rank: '87',
  }, {
    answers: 13,
    rank: '89',
  }, {
    answers: 14,
    rank: '93',
  }, {
    answers: 15,
    rank: '96',
  }, {
    answers: 16,
    rank: '97',
  }, {
    answers: 17,
    rank: '98',
  }, {
    answers: 20,
    rank: '99',
  }, {
    answers: 22,
    rank: '99+',
  }];

  var currentTest = null;
  var users = $lfmo.define('users');

  service.all = function() {
    return tests;
  }
  service.get = function(testId) {
    return tests[testId];
  }
  service.getCurrentTest = function() {
    return tests[currentTest];
  }
  service.draw = function() {
    var deferred = $q.defer();
    var random = Math.floor(Math.random() * tests.length);
    console.log(random, 'random draw');
    currentTest = random;
    deferred.resolve();
    return deferred.promise;
  }
  service.getPercentile = function(answers) {
    for (var i = percentile.length - 1; i >= 0; i--) {
      if (percentile[i].answers < parseInt(answers)) {
        return percentile[i].rank;
      }
    };
  }

  return service;
})

.factory('ResultsFactory', function($q, $lfmo) {
  var service = {};
  var results = [];

  service.all = function() {
    return results;
  },
  service.setResults = function(data) {
    results = data;
  },
  // service.remove = function(result) {
  //   results.splice(results.indexOf(result), 1);
  // },
  service.get = function(resultId) {
    var deferred = $q.defer();

    for (var i = 0; i < results.length; i++) {
      if (results[i].id === parseInt(resultId)) {
        deferred.resolve(results[i]);
      }
    }
    return deferred.promise;
  }

  return service;
});
