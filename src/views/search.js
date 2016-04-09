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
