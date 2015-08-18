(function() {
  'use strict';

  angular.module('app')
    .config(function($stateProvider) {
      $stateProvider
        .state('home', {
          url: '/',
          templateUrl: 'app/home/home.html',
          controller: function($scope){
            console.log('controller loaded');
          }
        });
    });

})();
