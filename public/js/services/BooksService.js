/*global angular:true, is:true, console: true */
App.service('BooksService', ['$http', '$q', '$location', 'conf', function($http, $q, $location, conf) {
    'use strict';

    var books = {};

    books.getBooks = function() {
        var def = $q.defer();
        $http.get(conf.apiRoot + conf.browseBooks)
            .success(function(response) {
                def.resolve(response);
            }, function(error) {
                def.reject(response);
            });
        return def.promise;
    };

    books.createNewBook = function(newBookEntry){
        return $http.post(conf.apiRoot + conf.browseBooks, newBookEntry);
    };

    books.removeBook = function(bookId){
        return $http.delete(conf.apiRoot + conf.singleBook + bookId);
    };

    books.updatePhoneBook = function(bookEntry){
        return $http.put(conf.apiRoot + conf.singleBook + bookEntry._id, bookEntry);
    };


    return books;
}]);