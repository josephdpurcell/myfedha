angular.module('myfedha', [
  'ui.router'
])

/**
 * App Configuration
 */
.config(function appConfig($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');

  // Viewing the home page
  $stateProvider.state('app', {
    url: '/',
    onEnter: function(){
      console.log('You have entered app.');
    },
    views: {
      'app': {
        templateUrl: '/js/app.tpl.html',
        controller: 'AppCtrl'
      }
    }
  });

  // Transaction landing page
  $stateProvider.state( 'app.transaction', {
    url: 'transaction',
    onEnter: function(){
      console.log('You have entered app.transaction');
    },
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
    onEnter: function(){
      console.log('You have entered app.transaction.add');
    },
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
    onEnter: function(){
      console.log('You have entered app.transaction.edit');
    },
    views: {
      'app@': {
        templateUrl: '/js/transaction_edit.tpl.html',
        controller: 'TransactionEditCtrl'
      }
    }
  });
})

/**
 * The Carbyne Core API
 */
.factory('HALTalkResource', function HALTalkResource() {
  return new Hyperagent.Resource({
    url: '/app_dev.php/api',
    headers: {
      'Accept': 'application/hal+json, application/json, */*; q=0.01',
      'X-Requested-With': 'XMLHttpRequest'
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
 * Transaction
 */
.controller('TransactionCtrl', function TransactionCtrl($scope, $state, $http){
  $scope.total = 0;
  $http({method: 'GET', url: '/api/transaction'}).
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
      console.log($scope.total);
      $scope.transactions = data;
    }).
    error(function(data, status, headers, config) {
      alert('Error');
    });
})

/**
 * Add Transaction
 */
.controller('TransactionAddCtrl', function TransactionAddCtrl($scope, $state, $stateParams, Messages, $http) {
  $scope.transaction = {
    description: '',
    amount: ''
  };
  $scope.save = function(transaction) {
    $http({method: 'POST', url: '/api/transaction', data:JSON.stringify(transaction)}).
      success(function(data, status, headers, config) {
        Messages.addMessage('Transaction added successfully!');
        $state.go('app.transaction');
      }).
      error(function(data, status, headers, config) {
        alert('Error');
      });
  };
})

/**
 * Edit Transaction
 */
.controller('TransactionEditCtrl', function TransactionAddCtrl($scope, $state, $stateParams, Messages, $http) {
  $scope.transaction = {
    description: '',
    amount: ''
  };

  $http({method: 'GET', url: '/api/transaction/'+$stateParams.id}).
    success(function(data, status, headers, config) {
      $scope.transaction = data;
    }).
    error(function(data, status, headers, config) {
      alert('Error');
    });

  $scope.save = function(transaction) {
    $http({method: 'PUT', url: '/api/transaction/'+$stateParams.id, data:JSON.stringify(transaction)}).
      success(function(data, status, headers, config) {
        Messages.addMessage('Transaction updated successfully!');
        $state.go('app.transaction');
      }).
      error(function(data, status, headers, config) {
        alert('Error');
      });
  };

  $scope.delete = function(transaction) {
    $http({method: 'DELETE', url: '/api/transaction/'+$stateParams.id}).
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
