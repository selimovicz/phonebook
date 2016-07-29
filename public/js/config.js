/*global App: true */
var App = angular.module('App', [
        'ui.router',
        'ngDialog'
    ])
    .constant('conf', {
    	notAuthenticated: 'auth-not-authenticated',
    	apiRoot: '/api',
    	auth: '/authenticate',
        browseBooks: '/books',
        singleBook: '/book/'
    })
    // creating iterceptor to attach access token to api requests
    .factory('BearerAuthInterceptor', function ($window, $q) {
	    return {
	        request: function(config) {
	            config.headers = config.headers || {};
	            if ($window.localStorage.getItem('tokenKey')) {
	                config.headers['x-access-token'] = window.localStorage.getItem('tokenKey');
	            }
	            return config || $q.when(config);
	        }
	    };
	}).config(function ($httpProvider) {
	    $httpProvider.interceptors.push('BearerAuthInterceptor');
	});