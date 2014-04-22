'use strict';

angular.module('fedhaApp')
  .factory('Goal', function($scope, $resource) {
      return $resource('http://localhost:1337/goal/:id');
  }, ['$scope', '$resource'])
  .controller('MainCtrl', function ($scope, $resource) {
          /*
    var Goal = $resource('http://localhost:1337/goal');
    var goals = Goal.query(function(){
      $scope.goals = goals;
    });
    */
  }, ['$scope', '$resource']);
