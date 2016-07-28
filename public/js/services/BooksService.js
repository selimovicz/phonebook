/*global angular:true, is:true, console: true */
App.service('BooksService', ['$http', '$q', '$location', 'conf', function($http, $q, $location, conf) {
    'use strict';

    var books = {};

    books.getBooks = function() {
        return $http.get(conf.apiRoot + conf.browseBooks)
            .success(function(response) {
                return response.data;
            }, function(response) {
                return response.status;
            });
    };

    books.createNewBook = function(newBookEntry){
        return $http.post(conf.apiRoot + conf.browseBooks, newBookEntry);
    };

    books.removeBook = function(bookId){
        return $http.delete(conf.apiRoot + conf.singleBook + bookId);
    };

    books.updatePhoneBook = function(bookEntry){
        return $http.post(conf.apiRoot + conf.browseBooks, newBookEntry);
    };


    return books;
}]);