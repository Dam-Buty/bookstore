(function () {

/*---------------------------------
LogosController v1.0
Génère et alimente les interfaces de CRUD des tables de paramétrage
sur la base du fichier scaffold.json
---------------------------------*/

angular.module('bookstore')
.controller("SearchController",
[ "$window", "$scope", "$rootScope",
function($window, $scope, $rootScope)  {
  $scope.current = {
    genre: $scope.genres[0],
    topic: $scope.topics[0]
  };
}
]);
})();
