(function () {
  angular.module("bookstore", ['ngRoute', 'angularUtils.directives.dirPagination'])
  .config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'views/search.html',
      controller: 'SearchController'
    })
    .when('/details/:bookId', {
      templateUrl: 'views/book.html',
      controller: 'BookController'
    })
    .otherwise("/");
  }])
  .controller("BookstoreController",
  [ "$window", "$scope", "$rootScope", "$http", "$location",
  function($window, $scope, $rootScope, $http, $location) {
    $rootScope.books = [];
    $rootScope.currentBook = null;
    $rootScope.indexes = {
      genres: {},
      topics: {}
    };

    /**
    * Navigate to a given book.
    * @param {String} bookId The book's ID
    */
    $rootScope.navigate = function(bookId) {
      $location.path("/details/" + bookId);
    };

    $scope.jsonURL = "assets/books.json";
    $scope.ready = false;

    $http({
      method: "GET",
      url: $scope.jsonURL
    }).then(function success(response) {
      var books = response.data;
      var genres = [], topics = [];

      // First we make a list of all available genres and topics
      books.forEach(function(book) {
        var genre = book.genre.category;
        var topic = book.genre.name;

        if (genres.indexOf(genre) === -1) { genres.push(genre); }
        if (topics.indexOf(topic) === -1) { topics.push(topic); }
      });

      // The data is stored in the rootScope so it can be accessed by all controllers
      $rootScope.books = books;
      $rootScope.genres = genres;
      $rootScope.topics = topics;

      // $scope.ready controls the display of a loading screen
      // ( add a typo to jsonURL to see it in action :p )
      $scope.ready = true;
    }, function error(response) {
      console.log(response.status + " " + response.statusText);
      console.log(response.data);
      return $q.reject("Erreur");
    });
  }])
  ;
})();

(function () {

/*---------------------------------
Book-card v1.0
Briefly presents a book
- expects 1 book
---------------------------------*/

angular.module('bookstore')
.directive("bookCard", ["$rootScope", function($rootScope) {
  return {
    restrict: 'E',
    scope: {
      book: "="
    },
    templateUrl: 'views/components/book-card.html'
  };
}]);
})();

(function () {

/*---------------------------------
BookController v1.0
The page with the details of a book
---------------------------------*/

angular.module('bookstore')
.controller("BookController",
[ "$window", "$scope", "$rootScope", "$routeParams",
function($window, $scope, $rootScope, $routeParams)  {
  $scope.book = null;
  $scope.matches = {
    exact: [],    // books with same genre AND same topic
    topic: [],    // books with just the same topic
    genre: []     // books with just the same genre
  };
  $scope.recommended = [];

  // First we retrieve the selected book
  $scope.books.some(function(book) {
    if (book.id == $routeParams.bookId) {
      $scope.book = book;
      return true;
    }
    return false;
  });

  // Then we retrieve all genre and topic matches
  $scope.books.some(function(book) {
    if (book.id !== $scope.book.id) {
      var genre = $scope.book.genre;

      if (genre.name === book.genre.name) {
        if (genre.category === book.genre.category) {
          // Each matched book gets a "recommendedFor" property
          // that will be displayed to the user ("Because you're interested in...")
          book.recommendedFor = book.genre.category + " about " + book.genre.name;
          $scope.matches.exact.push(book);
          // If we have 3 exact matches we can stop looping through the books
          if ($scope.matches.exact.length === 3) return true;
        } else {
          book.recommendedFor = book.genre.name;
          $scope.matches.topic.push(book);
        }
      } else {
        if (genre.category === book.genre.category) {
          book.recommendedFor = book.genre.category;
          $scope.matches.genre.push(book);
        }
      }
    }

    return false;
  });

  // courtesy of http://stackoverflow.com/a/6274381
  /**
  * Shuffles array in place.
  * @param {Array} a items The array containing the items.
  */
  var shuffle = function(a) {
      var j, x, i;
      for (i = a.length; i; i -= 1) {
          j = Math.floor(Math.random() * i);
          x = a[i - 1];
          a[i - 1] = a[j];
          a[j] = x;
      }

      return a;
  };

  // So we want to get 3 books from our 3 sets of recomendation. The order of preference is
  // exact matches > topic matches > genre matches
  // ==
  // To do this, we 'll first shuffle the matches arrays, then concat them in order of preference
  // And just get the first 3 items in the resulting array.
   $scope.recommended = $scope.recommended
  .concat(shuffle($scope.matches.exact))
  .concat(shuffle($scope.matches.topic))
  .concat(shuffle($scope.matches.genre))
  .slice(0,3);

  var published = moment($scope.book.published);
  $scope.book.$ago = published.fromNow();
  $scope.book.$date = published.format("MMMM Do YYYY");
}
]);
})();

(function () {

/*---------------------------------
SearchController v1.0
The main page with the book search engine
---------------------------------*/

angular.module('bookstore')
.controller("SearchController",
[ "$window", "$scope", "$rootScope", "$location",
function($window, $scope, $rootScope, $location)  {
  // This could be used to control the Search view but right now
  // all the pagination, filtering and searching is declarative
  // and resides in the search.html template
}
]);
})();
