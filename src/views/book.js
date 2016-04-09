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
    exact: [],
    topic: [],
    genre: []
  };
  $scope.recommended = [];

  $scope.books.some(function(book) {
    if (book.id == $routeParams.bookId) {
      $scope.book = book;
      return true;
    }
    return false;
  });

  $scope.books.some(function(book) {
    if (book.id !== $scope.book.id) {
      var genre = $scope.book.genre;

      if (genre.name === book.genre.name) {
        if (genre.category === book.genre.category) {
          book.recommendedFor = book.genre.category + " about " + book.genre.name;
          $scope.matches.exact.push(book);
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

   $scope.recommended = $scope.recommended
  .concat($scope.matches.exact)
  .concat($scope.matches.topic)
  .concat($scope.matches.genre)
  .slice(0,3);

  var published = moment($scope.book.published);
  $scope.book.$ago = published.fromNow();
  $scope.book.$date = published.format("MMMM Do YYYY");

  console.log($scope);
}
]);
})();
