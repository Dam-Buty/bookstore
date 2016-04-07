(function () {
  angular.module("bookstore", ['ngRoute'])
  .config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'views/search.html',
      controller: 'SearchController'
    })
    .when('/:book', {
      templateUrl: 'views/book.html',
      controller: 'BookController'
    })
    .otherwise("/");

    // $locationProvider.html5Mode(true);
  }])
  .controller("BookstoreController",
  [ "$window", "$scope", "$rootScope", "$http",
  function($window, $scope, $rootScope, $http) {
    $rootScope.books = [];
    $rootScope.indexes = {
      genres: {},
      topics: {}
    };

    $scope.jsonURL = "assets/books.json";
    $scope.ready = false;

    $http({
      method: "GET",
      url: $scope.jsonURL
    }).then(function success(response) {
      var books = response.data;
      var genres = [], topics = [];

      // Lists all genres and topics
      books.forEach(function(book) {
        var genre = book.genre.category;
        var topic = book.genre.name;

        if (genres.indexOf(genre) === -1) { genres.push(genre); }
        if (topics.indexOf(topic) === -1) { topics.push(topic); }
      });

      $rootScope.books = books;
      $rootScope.genres = genres;
      $rootScope.topics = topics;

      $scope.ready = true;
    }, function error(response) {
      console.log(response.status + " " + response.statusText);
      console.log(response.data);
      return $q.reject("Erreur");
    });
  }])
  ;
})();
