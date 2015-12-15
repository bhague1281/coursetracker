angular.module('CourseTracker', ['CourseCtrls', 'ui.router'])
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
  .state('index', {
    url: '/',
    templateUrl: 'app/views/index.html',
    controller: 'IndexCtrl'
  })
  .state('admin', {
    url: '/admin',
    templateUrl: 'app/views/admin/index.html',
    controller: 'AdminIndexCtrl'
  })
  // .when('/', {
  //   templateUrl: 'app/views/index.html',
  //   controller: 'IndexCtrl'
  // })
  // .when('/admin', {
  //   templateUrl: 'app/views/admin/index.html',
  //   controller: 'AdminIndexCtrl'
  // })

  // $locationProvider.html5Mode(false).hashPrefix('!');
}])
