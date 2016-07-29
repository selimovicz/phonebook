/*global App: true, angular:true */
App.controller('LoginController', [
    '$scope',
    '$log',
    '$rootScope',
    '$state',
    '$stateParams',
    'LoginService',
    function($scope, $log, $rootScope, $state, $stateParams, LoginService) {
        'use strict';
        
        $scope.user = {};

        $scope.doLogin = function(){

        	// Email validity check
	        var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	        if(!emailRegex.test($scope.user.email)) {
	          $scope.error = { is : true, message: "Email is not valid.", cause: 'email' };
	        }else{
	        	LoginService.doLogin($scope.user).then(function(response){
	        		$state.go('books');
	        	}, function(error){
	        		$scope.error = { is : true, message: error.message, cause: error.cause };
	        	});
	        }
        };

        if(LoginService.isAuthenticated) {
        	$state.go('books');
        }

        $scope.clearError = function(){
        	$scope.error = {};
        };

    }
]);