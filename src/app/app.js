(function() {
  'use strict';

  angular.module('app', [
		'ui.router',
		'app.config'
  ])
  
	.config(function($logProvider, $locationProvider, $urlRouterProvider){
		$logProvider.debugEnabled(true);
		$urlRouterProvider.otherwise('/');
		$locationProvider.html5Mode(true);
	})
	
	.run(function(ENV){
		console.log(ENV.application + ' loaded in ' + ENV.name + ' mode.');
		console.log('Build date ' + ENV.buildDate);
	});

})();
