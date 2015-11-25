var app = angular.module('ClassroomApp', ['ngRoute']);

app.controller('RouteController', ['$http', '$scope', '$route', '$routeParams', '$location',
function($http, $scope, $route, $routeParams, $location) {
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;
}]);

app.config(['$routeProvider', '$locationProvider',
function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
  $routeProvider.
  when('/', {
    templateUrl: 'templates/main.html',
    controller: 'ClassController',
    controllerAs: 'classCtrl'
  })
//   // .when('/search', {
//   //   templateUrl: '/templates/index.html',
//   //   controller: 'EmailController',
//   //   controllerAs: 'emailCtrl'
//   // }).when('/enter', {
//   //   templateUrl: '/templates/enter.html',
//   //   controller: 'EmailController',
//   //   controllerAs: 'emailCtrl'
//   // }).when('/emails/:id', {
//   //   templateUrl: '/templates/show.html',
//   //   controller: 'SpecificController',
//   //   controllerAs: 'specificCtrl',
//   // })
}]);

///////////////////////////////////////////////////////////////////////
/////////////////// NOTE: Session Controller///////////////////////
/////////////////////////////////////////////////////////////////////

app.controller('SessionController', ['$http', '$scope', '$window',
function($http, $scope, $window) {
  var controller = this;

  $http.get('/').success(function (data) {
    // controller.current_user = data.current_user;
    console.log("in here!")
  });

  this.deleteSession = function () {
    $http.delete('/session', {
    }).success(function(data){
    })
  }
}])
//
// ///////////////////////////////////////////////////////////////////////
// /////////////////// NOTE: Class Controller///////////////////////
// /////////////////////////////////////////////////////////////////////
//
app.controller('ClassController', ['$http', function($http){

}]);
//
// app.controller('StudentController', ['$http', function($http){
//
// }]);
