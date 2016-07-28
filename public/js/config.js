/*global App: true */
var App = angular.module('App', [
        'ui.router',
        'ngDialog'
    ])
    .constant('conf', {
    	apiRoot: '/api',
        browseBooks: '/books',
        singleBook: '/book/'
    });