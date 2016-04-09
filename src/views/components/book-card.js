(function () {

/*---------------------------------
Book-card v1.0
Briefly presents a book
- expects 1 book
---------------------------------*/

angular.module('bookstore')
.directive("bookCard", function($rootScope) {
  return {
    restrict: 'E',
    scope: {
      book: "="
    },
    templateUrl: 'views/components/book-card.html'
  };
});
})();
