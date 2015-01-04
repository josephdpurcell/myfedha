angular.module('myfedha', [
  'ui.router',
  'myfedha-db'
])

/**
 * App Configuration
 */
.config(function appConfig($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('');

  $stateProvider.state('app', {
    url: '',
    views: {
      'app': {
        templateUrl: '/js/app.tpl.html',
        controller: 'AppCtrl'
      }
    }
  });

  $stateProvider.state('app.transactions', {
    url: '/transactions',
    views: {
      'app@': {
        templateUrl: '/js/transactions.tpl.html',
        controller: 'TransactionsCtrl'
      }
    },
    resolve: {
      transactions: function(TransactionRepository) {
        return TransactionRepository.findAll()
      }
    }
  });

  $stateProvider.state('app.transactions.edit', {
    url: '/:id/edit',
    views: {
      'app@': {
        templateUrl: '/js/transactions.edit.tpl.html',
        controller: 'TransactionsEditCtrl'
      }
    },
    resolve: {
      transaction: function(TransactionRepository, $stateParams) {
        return TransactionRepository.find($stateParams.id)
      }
    }
  });

})

/**
 * The Transaction repository.
 */
.factory('TransactionRepository', function TransactionsRepository(DBAL){
    return {
      findAll: function() {
        return DBAL.findAll('transactions')
      },
      find: function(id) {
        return DBAL.find('transactions', id)
      },
      save: function(data) {
        return DBAL.save('transactions', data)
      },
      delete: function(data) {
        return DBAL.delete('transactions', data)
      }
    };
})

/**
 * The Main App Controller.
 */
.controller('AppCtrl', function AppCtrl(){
})

.controller('TransactionsCtrl', function TransactionsCtrl($scope, $state, TransactionRepository, transactions){
  $scope.transactions = transactions;

  var blankTransaction = {
    date: moment().format('YYYY-MM-DD HH:mm:ss'),
    description: null,
    amount: null
  };
  $scope.transaction = angular.copy(blankTransaction);

  $scope.edit = function(id) {
    $state.go('app.transactions.edit', {id:id});
  };

  $scope.save = function(valid, transaction) {
    $scope.addTransaction.submitted = true;
    if (valid) {
      // Reset the form for when we use it again.
      $scope.addTransaction.$setPristine();
      $scope.transaction = angular.copy(blankTransaction);
      // Save the transaction.
      TransactionRepository.save(transaction);
    }
  };

})

.controller('TransactionsEditCtrl', function TransactionsEditCtrl($scope, $state, TransactionRepository, transaction){
  $scope.transaction = angular.copy(transaction);

  $scope.save = function(valid, transaction) {
    $scope.editTransaction.submitted = true;
    if (valid) {
      // Reset the form for when we use it again.
      $scope.transaction = transaction;
      $scope.editTransaction.$setPristine();
      // Save the transaction.
      TransactionRepository.save(transaction);
      // Go back to the index.
      $state.go('^')
    }
  };

  $scope.delete = function(transaction) {
    // Reset the form for when we use it again.
    $scope.transaction = transaction;
    $scope.editTransaction.$setPristine();

    // Delete the transaction.
    TransactionRepository.delete(transaction);

    // Go back to the index.
    $state.go('^')
  };
})

;
