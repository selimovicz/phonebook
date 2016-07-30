/*global App: true, angular:true */
App.controller('MasterController', [
    '$scope',
    '$log',
    '$rootScope',
    '$stateParams',
    '$timeout',
    '$state',
    'getBooks',
    'ngDialog',
    'BooksService',
    'LoginService',
    function($scope, $log, $rootScope, $stateParams, $timeout, $state, getBooks, ngDialog, BooksService, LoginService) {
        'use strict';

      $scope.books = {
      	all : getBooks.data,
      	sortBy: 'firstName',
      	createNew: function(){},
      	editBookEntry: function(bookId){},
      	deleteBookEntry: function(bookId){},
        sort: function(){}
      };

      $scope.closeModalPromise = function(modalName, book) {
        $scope[modalName].closePromise.then(data => {
          $scope.books.modalTriggered = false;

          // restore old value if cancel edit
          if(book && $scope.modalData.editing && !$scope.modalData.entrySaved){
             BooksService.getBooks().then(function(response){
              $scope.books.all = response.data;
              $scope.modalData = {};
            });
          }else{
            $scope.modalData = {};
          }
        });
      };

      $scope.$watch('books.sortBy', function(){
      	$scope.books.sorting = true;
      	$timeout(function(){
      		$scope.books.sorting = false;
      	}, 500);
      });

      $scope.books.editBookEntry = function(book){
      	// if modal alaready triggered and 
      	if($scope.books.modalTriggered){

      		var requestBody = setRequestBody();
      		BooksService.updatePhoneBook($scope.modalData.book).then(function(response){
      			$scope.modalData.entrySaved = true;
      			onSuccessEntry(book);
      		});

      	}else{
      		// trigger ngDialog
      		$scope.books.modalTriggered = true;
      		$scope.modalData = { book : book };
      		$scope.oldBookValue = angular.copy(book);
      		$scope.modalData.editing = true;
      		$scope.modalData.modalTitle = "Edit Phonebook entry";
      		$scope.createNewModal = ngDialog.open({ template: 'js/views/partials/_book_modal.html', scope: $scope });

          /* fetch close modal event and trigger 
          propper functoion to clear up data */
          $scope.closeModalPromise('createNewModal', book);

      	}
      };

      $scope.books.createNew = function(){
        	
      	// if modal alaready triggered and 
      	if($scope.books.modalTriggered){

      		var requestBody = setRequestBody();
        	BooksService.createNewBook(requestBody).then(function(response){

        		$scope.modalData.entrySaved = true;
        		var book = response.data[response.data.length -1];
        		book.newlyAdded = true;

        		onSuccessEntry(book);

        	});

      	}else{

      		// trigger ngDialog
      		$scope.books.modalTriggered = true;
      		$scope.modalData = { modalTitle : "Create new Phonebook entry", newBook : true, book: {} }; 
      		$scope.createNewModal = ngDialog.open({
              template: 'js/views/partials/_book_modal.html',
              scope: $scope
          });

          /* fetch close modal event and trigger 
          propper functoion to clear up data */
          $scope.closeModalPromise('createNewModal');

      	}
     	};

     	$scope.books.closeDialog = function(book){
     		ngDialog.close();
     	};

      $scope.books.sort = function(){
        BooksService.getBooks().then(function(response){
          $scope.books.all = response.data;
        });
      };

     	$scope.books.deleteBookEntry = function(book){
     		if(book.confirmDelete){
     			BooksService.removeBook(book._id).then(function(){
     				book.confirmedDelete = true;
     				$timeout(function(){ $scope.books.all.splice($scope.books.all.indexOf(book), 1); },1000);
     			});
     		}else{
     			book.confirmDelete = true;
     			$timeout(function(){
     				book.confirmDelete = false;
     			}, 5000);
     		}
     	};

      $scope.logout = function(){
        LoginService.logout();
        $state.go('login');
      };

      function setRequestBody(){
      	return {
      		firstName: $scope.modalData.book.firstName,
      		lastName: $scope.modalData.book.lastName,
      		phoneNumber: $scope.modalData.book.phoneNumber
      	};
      }

      function onSuccessEntry(book){
  		 $timeout(function(){
    			$scope.books.closeDialog();
    			if(book.newlyAdded) { $scope.books.all.push(book); }else { book.edited = true; }
    		}, 2000);
      }

    }
]);