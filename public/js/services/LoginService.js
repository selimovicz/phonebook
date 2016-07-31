/*global angular:true, is:true, console: true */
App.service('LoginService', ['$http', '$q', '$location', 'conf', function($http, $q, $location, conf) {
    'use strict';

    var login = {};
    var LOCAL_TOKEN_KEY = 'tokenKey';

  	login.isAuthenticated = false;
 
	function loadUserCredentials() {
		var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
		if (token) {
		  login.isAuthenticated = true;
		}
	}
 
	function storeUserCredentials(token) {
		window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
		login.isAuthenticated = true;
	}
	
	function destroyUserCredentials() {
		login.isAuthenticated = false;
		window.localStorage.removeItem(LOCAL_TOKEN_KEY);
	}

	login.doLogin = function(user) {

	  var def = $q.defer();
	  $http.post(conf.apiRoot + conf.auth, user).then(function(result) {
	      storeUserCredentials(result.data.token);
	      def.resolve(result.data);
	  }, function(error){
	  	def.reject(error.data);
	  });
	  return def.promise;

	};

	login.logout = function() {
		destroyUserCredentials();
	};

	loadUserCredentials();

    return login;
}]);