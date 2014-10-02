/**
 * @todo: Design a pager that is a daterange that can be +/-
 * @todo: Add goals that are tied to a daterange.
 */
angular.module('myfedha', [
  'ui.router',
  'ngCookies'
])

/**
 * AutoFocus Directive
 */
.directive('focus', function($timeout) {
  return {
    scope : {
      trigger : '@focus'
    },
    link : function(scope, element) {
      scope.$watch('trigger', function(value) {
        if (value === "true") {
          $timeout(function() {
            element[0].focus();
          });
        }
      });
    }
  };
})

/**
 * App Configuration
 */
.config(function appConfig($stateProvider, $urlRouterProvider, $httpProvider) {

  /*
  $httpProvider.interceptors.push(function($q) {
    return {
      'request': function(config) {
        // same as above
        return config;
      },
      'response': function(response) {
        if (response.status==401) {
          window.location.href = 'http://myfedha.com/';
        } else {
          return response;
        }
      }
    };
  });
  */

  $urlRouterProvider.otherwise('/');

  // Viewing the home page
  $stateProvider.state('app', {
    url: '/',
    views: {
      'app': {
        templateUrl: '/js/app.tpl.html',
        controller: 'AppCtrl'
      }
    }
  });

  // Login
  $stateProvider.state( 'app.login', {
    url: 'login',
    views: {
      'app@': {
        templateUrl: '/js/login.tpl.html',
        controller: 'LoginCtrl'
      }
    }
  });

  // Transaction landing page
  $stateProvider.state( 'app.transaction', {
    url: 'transaction',
    views: {
      'app@': {
        templateUrl: '/js/transaction.tpl.html',
        controller: 'TransactionCtrl'
      }
    }
  });

  // Add
  $stateProvider.state( 'app.transaction.add', {
    url: '/add',
    views: {
      'app@': {
        templateUrl: '/js/transaction_add.tpl.html',
        controller: 'TransactionAddCtrl'
      }
    }
  });

  // Edit
  $stateProvider.state( 'app.transaction.edit', {
    url: '/:id/edit',
    views: {
      'app@': {
        templateUrl: '/js/transaction_edit.tpl.html',
        controller: 'TransactionEditCtrl'
      }
    }
  });
})

/**
 * A Messages Handler
 */
.factory('Messages', function Messages(){
  return {
    messages: [],
    popMessages: function(){
      var messages = this.messages;
      this.messages = [];
      return messages;
    },
    addMessage: function(message){
      this.messages.push(message);
    }
  };
})

/**
 * The Main App Controller
 *
 * Note: this sort of acts like a global scope
 */
.controller('AppCtrl', function AppCtrl($scope, $state){
  // nothing here yet
})

/**
 * Login
 */
.controller('LoginCtrl', function LoginCtrl($scope, $state, $http, $cookies){
  $scope.user = {
    username: '',
    password: ''
  };
  if ($cookies.access_token) {
    $state.go('app.transaction');
  }
  $scope.login = function(valid, user){
    $http({method: 'POST', url: '/api/authenticate', data:{username:user.username, password:user.password}}).
      success(function(data, status, headers, config) {
        $cookies.access_token = data.access_token;
        //$state.go('app.transactions');
      }).
      error(function(data, status, headers, config) {
        alert(data.message);
      });
  };
})

/**
 * Transaction
 */
.controller('TransactionCtrl', function TransactionCtrl($scope, $state, $http, $cookies){
  $scope.title = moment().format('MMMM YYYY');
  $scope.edit = function(id){
    $state.go('app.transaction.edit', {id:id});
  };
  var goal = 300;
  var daysInMonth = moment().endOf('month').format('D');
  var goalPerDay = goal / daysInMonth;
  var goalToday = goalPerDay * moment().format('D');
  $scope.goalToday = goalToday;
  $scope.trending = 0;
  $scope.total = 0;
  var start = moment().startOf('month').unix();
  var end = moment().endOf('month').unix();
  $http({method: 'GET', url: '/api/transaction', params:{start:start,end:end}, headers:{Authorization:"OAuth "+$cookies.access_token}}).
    success(function(data, status, headers, config) {
      var total = 0;
      var value = 0;
      for (var i in data) {
        value = parseFloat(data[i].amount);
        if (value) {
          total = total + value;
        }
      }
      $scope.total = total;
      $scope.trending = total / goalToday * 100;
      $scope.transactions = data;
    }).
    error(function(data, status, headers, config) {
      alert('Error');
    });
})

/**
 * Add Transaction
 */
.controller('TransactionAddCtrl', function TransactionAddCtrl($scope, $state, $stateParams, Messages, $http, $cookies) {
  $scope.transaction = {
    description: '',
    amount: '',
    date: moment().format('YYYY-MM-DD HH:mm:ss')
  };
  $scope.save = function(valid, transaction) {
    $scope.addTransaction.submitted = true;
    if (valid) {
      $http({method: 'POST', url: '/api/transaction', data:JSON.stringify(transaction), headers:{Authorization:"OAuth "+$cookies.access_token}}).
        success(function(data, status, headers, config) {
          Messages.addMessage('Transaction added successfully!');
          $state.go('app.transaction');
        }).
        error(function(data, status, headers, config) {
          alert('Error');
        });
    }
  };
})

/**
 * Edit Transaction
 */
.controller('TransactionEditCtrl', function TransactionAddCtrl($scope, $state, $stateParams, Messages, $http, $cookies) {
  $scope.transaction = {
    description: '',
    amount: '',
    date: ''
  };

  $http({method: 'GET', url: '/api/transaction/'+$stateParams.id, headers:{Authorization:"OAuth "+$cookies.access_token}}).
    success(function(data, status, headers, config) {
      $scope.transaction = data;
    }).
    error(function(data, status, headers, config) {
      alert('Error');
    });

  $scope.save = function(valid, transaction) {
    if (valid) {
      $http({method: 'PUT', url: '/api/transaction/'+$stateParams.id, data:JSON.stringify(transaction), headers:{Authorization:"OAuth "+$cookies.access_token}}).
        success(function(data, status, headers, config) {
          Messages.addMessage('Transaction updated successfully!');
          $state.go('app.transaction');
        }).
        error(function(data, status, headers, config) {
          console.log(data);
          console.log(status);
          console.log(headers);
          console.log(config);
          alert('Error');
        });
    }
  };

  $scope.delete = function(transaction) {
    $http({method: 'DELETE', url: '/api/transaction/'+$stateParams.id, headers:{Authorization:"OAuth "+$cookies.access_token}}).
      success(function(data, status, headers, config) {
        Messages.addMessage('Transaction deleted successfully!');
        $state.go('app.transaction');
      }).
      error(function(data, status, headers, config) {
        alert('Error');
      });
  };
})


/**
 * View a ContentGroup
 */
.controller('ContentGroupViewCtrl', function contentGroupCtrl($scope, contentGroup, $state, $stateParams, Messages) {
  $scope.contentGroupId = $stateParams.contentGroupId;
  $scope.messages = Messages.popMessages();
  $scope.formData = contentGroup;
  $scope.master = {};
})

;
