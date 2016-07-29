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
                    },
                    authenticate: true
                });
        }
    ])
    .run(function($rootScope, $state, LoginService) {
        $rootScope.$on('$stateChangeStart',
          function(event, toState) {
            if (toState.authenticate && !LoginService.isAuthenticated) {
              $state.go('login');
              event.preventDefault();
            }
          });
      });