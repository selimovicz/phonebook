/*global angular:true, is:true, console: true */
App.service('LoginService', ['$http', '$q', '$location', 'conf', function($http, $q, $location, conf) {
    'use strict';

    var login = {};

    // local storage identifier
    var LOCAL_TOKEN_KEY = 'tokenKey';

    // setting service variable isAuthenticated to false - default value
  	login.isAuthenticated = false;
 	
 	// loading token from local storage
	function loadUserCredentials() {
		var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
		if (token) {
		  login.isAuthenticated = true;
		}
	}
 	
 	// storing token in local storage uppon successful login
	function storeUserCredentials(token) {
		window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
		login.isAuthenticated = true;
	}
	
	// destroying token & setting isAuthenticated to false - on logout
	function destroyUserCredentials() {
		login.isAuthenticated = false;
		window.localStorage.removeItem(LOCAL_TOKEN_KEY);
	}

	// login function - hitting /api/authenticate
	login.doLogin = function(user) {

		var def = $q.defer();
		$http.post(conf.apiRoot + conf.auth, user).then(function(result) {
			// if successful login - store token in localstorage
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