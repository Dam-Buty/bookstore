(function () {

/*---------------------------------
SearchController v1.0
The main page with the book search engine
---------------------------------*/

angular.module('bookstore')
.controller("SearchController",
[ "$window", "$scope", "$rootScope", "$location",
function($window, $scope, $rootScope, $location)  {
  $scope.current = {
    genre: $scope.genres[0],
    topic: $scope.topics[0]
  };
    // console.log('$scope');

  $scope.navigate = function(bookId) {
    $location.path("/details/" + bookId);
  };
}
]);
})();
