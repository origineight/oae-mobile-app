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

  var currentTest = null;
  var users = $lfmo.define('users');

  service.all = function() {
    return tests;
  }
  service.get = function(testId) {
    return tests[testId];
    // for (var i = 0; i < tests.length; i++) {
    //   if (tests[i].id === parseInt(testId)) {
    //     return tests[i];
    //   }
    // }
    // return null;
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
  // service.saveIdeas = function(uid, testId, ideas) {
  //   var deferred = $q.defer();
  //   var promise = deferred.promise;
  //   console.log(uid, 'saveIdeas uid');
  //   console.log(testId, 'saveIdeas testId');
  //   console.log(ideas, 'saveIdeas ideas');

  //   users.get(uid).then(function (user) {
  //     console.log(user, 'user loaded')
  //     newIdeas = user.tests;
  //     newIdeas.push({
  //       testId: testId,
  //       ideas: ideas
  //     });
  //     users.update(uid, {tests: newIdeas}).then(function (user) {
  //       console.log(user, 'ideas saved');
  //       deferred.resolve();
  //     });
  //   })
  //   return deferred.promise;
  // }

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
