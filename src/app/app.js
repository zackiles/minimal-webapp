(function() {
  'use strict';

  angular.module('app', ['ui.router'])
    .config(function($logProvider, $locationProvider, $urlRouterProvider){
      $logProvider.debugEnabled(true);
      $urlRouterProvider.otherwise('/');
      $locationProvider.html5Mode(true);
    });

})();
