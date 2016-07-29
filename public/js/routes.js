/*global App: true, angular:true */
App
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise("/");

            $stateProvider
                .state('login', {
                    url: '/',
                    templateUrl: 'js/views/login.html',
                    controller: 'LoginController'
                })
                .state('books', {
                    url: '/books',
                    templateUrl: 'js/views/initial_screen.html',
                    controller: 'MasterController',
                    resolve: {
                        getBooks: function(BooksService){
                            return BooksService.getBooks();
                        }
                    }
                });
                // .state('location.instance', {
                //     url: ':locationId',
                //     views: {
                //         'instance': {
                //             templateUrl: 'js/views/location_instance.html',
                //             controller: 'LocationInstanceController'
                //         }
                //     },
                //     resolve: {
                //         getLocationInstance: function($stateParams, LocationService) {
                //             return LocationService.getLocations($stateParams.locationId);
                //         }
                //     }
                // });
        }
    ]);