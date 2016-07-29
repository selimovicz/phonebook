/*global angular:true, is:true, console: true */
App.service('LoginService', ['$http', '$q', '$location', 'conf', function($http, $q, $location, conf) {
    'use strict';

    var login = {};
    var LOCAL_TOKEN_KEY = 'tokenKey';
  	var authToken;

  	login.isAuthenticated = false;
 
	function loadUserCredentials() {
		var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
		if (token) {
		  useCredentials(token);
		}
	}
 
	function storeUserCredentials(token) {
		window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
		useCredentials(token);
	}
	 
	function useCredentials(token) {
		login.isAuthenticated = true;
		authToken = token;

		// Set the token as header for your requests!
		$http.defaults.headers.common.Authorization = authToken;
	}

	function destroyUserCredentials() {
		authToken = undefined;
		login.isAuthenticated = false;
		$http.defaults.headers.common.Authorization = undefined;
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