/*global App: true, angular:true */
App
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise("/");

            // setting up the routes
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
                    },
                    authenticate: true
                });
        }
    ])
    // preventing hitting routes which demand auth
    .run(function($rootScope, $state, LoginService) {
        $rootScope.$on('$stateChangeStart',
          function(event, toState) {
            if (toState.authenticate && !LoginService.isAuthenticated) {
              $state.go('login');
              event.preventDefault();
            }
          });
      });