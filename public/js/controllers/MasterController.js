/*global App: true, angular:true */
App.controller('MasterController', [
    '$scope',
    '$log',
    '$rootScope',
    '$stateParams',
    '$timeout',
    'getBooks',
    'ngDialog',
    'BooksService',
    function($scope, $log, $rootScope, $stateParams, $timeout, getBooks, ngDialog, BooksService) {
        'use strict';

        $scope.books = {
        	all : getBooks.data,
        	createNew: function(){},
        	editBookEntry: function(bookId){},
        	deleteBookEntry: function(bookId){}
        };

        $scope.closeModalPromise = function(modalName) {
	        $scope[modalName].closePromise.then(data => {
	          $scope.books.modalTriggered = false;
	          $scope.modalData = {};
	        });
	    };

	    $scope.books.editBookEntry = function(book){
	    	// if modal alaready triggered and 
        	if($scope.books.modalTriggered){

        		var requestBody = setRequestBody();
        		BooksService.updatePhoneBook().then(function(response){

        			onSuccessEntry(book);
        		});

        	}else{
        		// trigger ngDialog
        		$scope.books.modalTriggered = true;
        		$scope.modalData = book;
        		$scope.modalData.modalTitle = "Edit Phonebook entry";
        		$scope.createNewModal = ngDialog.open({ template: 'js/views/partials/_book_modal.html', scope: $scope });

		        /* fetch close modal event and trigger 
		        propper functoion to clear up data */
		        $scope.closeModalPromise('createNewModal');

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
        		$scope.modalData = { modalTitle : "Create new Phonebook entry", newBook : true}; 
        		$scope.createNewModal = ngDialog.open({
		            template: 'js/views/partials/_book_modal.html',
		            scope: $scope
		        });

		        /* fetch close modal event and trigger 
		        propper functoion to clear up data */
		        $scope.closeModalPromise('createNewModal');

        	}
       	};

       	$scope.books.closeDialog = function(){
       		ngDialog.close();
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

       	function setRequestBody(){
	    	return {
        		firstName: $scope.modalData.firstName,
        		lastName: $scope.modalData.lastName,
        		phoneNumber: $scope.modalData.phoneNumber
        	};
	    }

	    function onSuccessEntry(book){
			$timeout(function(){
    			$scope.books.closeDialog();
    			if(book.newlyAdded) $scope.books.all.push(book);
    		}, 2000);
	    }


    }
]);