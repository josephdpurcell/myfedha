angular.module('myfedha-budget', [
  'ui.router',
  'myfedha-api'
])


/**
 * Budget
 */
.controller('BudgetCtrl', function BudgetCtrl($scope, $state, $http, User, budgetData, accountData, $stateParams){
  // Page information.
  $scope.title = budgetData.title;

  // Paging config.
  $scope.page = budgetData.page;
  $scope.nextPage = (budgetData.page==budgetData.todayPage) ? false : budgetData.page + 1;
  $scope.prevPage = (budgetData.page==1) ? false : budgetData.page - 1;

  // A helper method to get the account name for a budget transaction.
  $scope.getAccountName = function(account_id) {
    var name = '';
    for (var i in $scope.accounts) {
      if ($scope.accounts[i].id==account_id) {
        name = $scope.accounts[i].description;
      }
    }
    return name;
  };

  // Actions.
  $scope.edit = function(id){
    $state.go('app.budget.edit', {id:id});
  };
  $scope.editAccount = function(id){
    $state.go('app.account.edit', {id:id});
  };
  $scope.pay = function(t) {
    var transaction = angular.copy(t);
    transaction.amount = transaction.estimate;
    $http({method: 'PUT', url: 'http://myfedha.com/api/budget/'+t.id, data:JSON.stringify(transaction)}).
      success(function(data, status, headers, config) {
        t.amount = t.estimate;
      }).
      error(function(data, status, headers, config) {
        console.log(data);
        console.log(status);
        console.log(headers);
        console.log(config);
        alert('Error');
      });
  };

  $scope.transactions = budgetData.transactions;

  // Update the account amounts to tx before pagedayPeriodStart
  for (var i in $scope.transactions) {
    // if it's paid, skip it
    if ($scope.transactions[i].amount==0) {
      // Continue if transaction was before this pageday start.
      var transaction_day = moment($scope.transactions[i].date);
      if (transaction_day.isBefore(budgetData.pagedayPeriodStart)) {
        for (var j in accountData.accounts) {
          if (accountData.accounts[j].id==$scope.transactions[i].account_id) {
            if ($scope.transactions[i].type=='income') {
              accountData.accounts[j].amount += parseFloat($scope.transactions[i].estimate);
            } else {
              accountData.accounts[j].amount -= parseFloat($scope.transactions[i].estimate);
            }
          }
        }
      }
    }
  }

  // Set the estimate value on accounts.
  for (var i in accountData.accounts) {
    accountData.accounts[i].estimate = accountData.accounts[i].amount;
  }
  for (var i in $scope.transactions) {
    // if it's paid, skip it
    if ($scope.transactions[i].amount==0) {
      // Continue if transaction was after this pageday start.
      var transaction_day = moment($scope.transactions[i].date);
      if (transaction_day.isAfter(budgetData.pagedayPeriodStart)) {
        for (var j in accountData.accounts) {
          if (accountData.accounts[j].id==$scope.transactions[i].account_id) {
            if ($scope.transactions[i].type=='income') {
              accountData.accounts[j].estimate += parseFloat($scope.transactions[i].estimate);
            } else {
              accountData.accounts[j].estimate -= parseFloat($scope.transactions[i].estimate);
            }
          }
        }
      }
    }
  }
  $scope.accounts = accountData.accounts;

  $scope.transactions_by_date = {};
  var date = '';
  for (var i in $scope.transactions) {
    date = $scope.transactions[i].date.substr(0, 10);
    if (typeof($scope.transactions_by_date[date]) == 'undefined') {
      $scope.transactions_by_date[date] = [];
    }
    $scope.transactions_by_date[date].push($scope.transactions[i]);
  }
})

/**
 * Add Budget
 */
.controller('BudgetAddCtrl', function BudgetAddCtrl($scope, $state, $stateParams, Messages, $http, User, budgetData, accountData) {
  $scope.transaction = {
    description: '',
    amount: '',
    date: moment().format('YYYY-MM-DD HH:mm:ss')
  };
  $scope.accounts = accountData.accounts;
  $scope.save = function(valid, transaction) {
    $scope.addTransaction.submitted = true;
    if (valid) {
      $http({method: 'POST', url: 'http://myfedha.com/api/budget', data:JSON.stringify(transaction)}).
        success(function(data, status, headers, config) {
          Messages.addMessage('Transaction added successfully!');
          budgetData.transactions.push(data);
          $state.go('app.budget');
        }).
        error(function(data, status, headers, config) {
          alert('Error');
        });
    }
  };
})

/**
 * Edit Budget
 */
.controller('BudgetEditCtrl', function BudgetAddCtrl($scope, $state, $stateParams, Messages, $http, User, budgetData, accountData) {
  $scope.transaction = {
    description: '',
    amount: '',
    date: ''
  };

  $scope.accounts = accountData.accounts;

  var index = 0;
  for (var i in budgetData.transactions) {
    if (budgetData.transactions[i].id == $stateParams.id) {
      index = i;
      angular.copy(budgetData.transactions[i], $scope.transaction);
      break;
    }
  }

  $scope.save = function(valid, transaction) {
    if (valid) {
      $http({method: 'PUT', url: 'http://myfedha.com/api/budget/'+$stateParams.id, data:JSON.stringify(transaction)}).
        success(function(data, status, headers, config) {
          Messages.addMessage('Transaction updated successfully!');
          budgetData.transactions[index] = $scope.transaction;
          $state.go('app.budget');
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
    $http({method: 'DELETE', url: 'http://myfedha.com/api/budget/'+$stateParams.id}).
      success(function(data, status, headers, config) {
        Messages.addMessage('Transaction deleted successfully!');
        budgetData.transactions.splice(index, 1);
        $state.go('app.budget');
      }).
      error(function(data, status, headers, config) {
        alert('Error');
      });
  };
})

