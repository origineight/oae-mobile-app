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
    var promise = deferred.promise;

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
          });
        });

        deferred.resolve();
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
          tests: []
        }).then(function (user) {
          console.log(user, 'user created');
        })
        deferred.resolve();
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

  return service;
})

.factory('Tests', function() {
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
    image: 'img/tests/Plastic Spool.jpg',
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

  return {
    all: function() {
      return tests;
    },
    get: function(testId) {
      for (var i = 0; i < tests.length; i++) {
        if (tests[i].id === parseInt(testId)) {
          return tests[i];
        }
      }
      return null;
    },
    draw: function() {
      var range = tests.length + 1;
      var random = Math.floor(Math.random() * range);
      console.log(random, 'draw random');
      return tests[random];
    }
  };
})

.factory('Results', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var results = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },{
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return results;
    },
    remove: function(result) {
      results.splice(results.indexOf(result), 1);
    },
    get: function(resultId) {
      for (var i = 0; i < results.length; i++) {
        if (results[i].id === parseInt(resultId)) {
          return results[i];
        }
      }
      return null;
    }
  };
});
