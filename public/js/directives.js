

angular.module('sfexpress.directives', [])
    .directive('loadingSpinner', ()=>{
        return {
            restrict: 'AE',
            template: '<div ng-class="{hidden: isHidden}" class="loader">' +
                '<img src="img/grid.svg" width="40"/>' +
            '</div>',
            controller: function($scope, $interval) {
                $scope.isHidden = true;
                $scope.$on('spinner:show', ()=>{
                    $scope.isHidden = false;
                })
                $scope.$on('spinner:hide', ()=>{
                    $scope.isHidden = true;
                })
            }
        }
    })
