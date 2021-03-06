// simple directive which allows triggering function on enter event i.e. ng-enter="doSomething()"
App.directive('onEnter', function () {
  return {
      restrict: 'A',
      scope: { onEnter: '&' },
      link: function (scope, elements, attrs) {
        elements.on('keydown keypress', function (e) {
          if (e.which === 13) {
            scope.$apply(function () {
                scope.$eval(scope.onEnter);
            });
            e.preventDefault();
          }
        });
      }
    };
});