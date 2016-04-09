(function () {

/*---------------------------------
BookController v1.0
The page with the details of a book
---------------------------------*/

angular.module('bookstore')
.controller("BookController",
[ "$window", "$scope", "$rootScope", "$routeParams",
function($window, $scope, $rootScope, $routeParams)  {

  var getBook = function(bookId) {
    var theBook;

    $scope.books.some(function(book) {
      if (book.id == bookId) {
        theBook = book;
        return true;
      }
      return false;
    });

    return theBook;
  };

  $scope.book = getBook($routeParams.bookId);

  var published = moment($scope.book.published);
  $scope.book.$ago = published.fromNow();
  $scope.book.$date = published.format("MMMM Do YYYY");
}
]);
})();
