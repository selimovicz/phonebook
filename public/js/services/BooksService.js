/*global angular:true, is:true, console: true */
App.service('BooksService', ['$http', '$q', '$location', 'conf', function($http, $q, $location, conf) {
    'use strict';

    var books = {};

    // getting all books with help of $q service
    // allowing formating response data
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

    // service function for adding new book
    books.createNewBook = function(newBookEntry){
        return $http.post(conf.apiRoot + conf.browseBooks, newBookEntry);
    };

    // removing existing book
    books.removeBook = function(bookId){
        return $http.delete(conf.apiRoot + conf.singleBook + bookId);
    };

    // updating existing book
    books.updatePhoneBook = function(bookEntry){
        return $http.put(conf.apiRoot + conf.singleBook + bookEntry._id, bookEntry);
    };


    return books;
}]);