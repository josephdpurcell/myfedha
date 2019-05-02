angular.module('myfedha-transaction', [
  'ui.router',
  'myfedha-api'
])

/**
 * Transaction
 */
.controller('TransactionCtrl', function TransactionCtrl($scope, $state, $http, User, transactionData){
  $scope.edit = function(id){
    $state.go('app.transaction.edit', {id:id});
  };
  $scope.title = transactionData.title;
  $scope.goal = transactionData.goal;
  $scope.transactions = transactionData.transactions;
  $scope.total = transactionData.total;
  $scope.trending = transactionData.trending;
  $scope.dayOfMonth = transactionData.dayOfMonth;
  $scope.daysInMonth = transactionData.daysInMonth;


  $scope.goalPerMonth = transactionData.goalPerMonth;
  $scope.goalPerDay = transactionData.goalPerDay;
  $scope.goalPerWeek = transactionData.goalPerWeek;
  $scope.goalToday = transactionData.goalToday;
  $scope.goalThisDayOfWeek = transactionData.goalThisDayOfWeek;
  $scope.goalThisWeek = transactionData.goalThisWeek;
  $scope.goalThisDayOfMonth = transactionData.goalThisDayOfMonth;
  $scope.goalThisMonth = transactionData.goalThisMonth;
  $scope.spentToday = transactionData.spentToday;
  $scope.spentThisWeek = transactionData.spentThisWeek;
  $scope.spentThisMonth = transactionData.spentThisMonth;
  $scope.trendingThisMonth = transactionData.trendingThisMonth;
  $scope.trendingUnderBudget = transactionData.trendingUnderBudget;

  $scope.spentOverBudget = transactionData.spentThisMonth - transactionData.goalThisDayOfMonth;
  $scope.spentUnderBudget = $scope.spentOverBudget * -1;
  $scope.waitDaysBeforeSpending = Math.round($scope.spentOverBudget / transactionData.goalPerDay);

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
 * Transaction Graph
 */
.controller('TransactionGraphCtrl', function TransactionGraphCtrl($scope, $state, $http, User){
  // Set day on each transaction.
  for (var i in $scope.transactions) {
    $scope.transactions[i].dayOfMonth = moment($scope.transactions[i].date).date();
    $scope.transactions[i].amount = parseFloat($scope.transactions[i].amount);
  }
  // Create each column
  var columns = [];
  var column1 = ['Actual'];
  var column2 = ['Average'];
  var column3 = ['Goal'];
  var avg = $scope.total / $scope.dayOfMonth;
  for (var day=1; day<=$scope.daysInMonth; day++) {
    var dayAmount = 0;
    for (var j in $scope.transactions) {
      if ($scope.transactions[j].dayOfMonth == day) {
        dayAmount += $scope.transactions[j].amount;
      }
    }
    column1.push(dayAmount);
    column2.push(avg);
    column3.push($scope.goalPerDay);
  }
  columns.push(column1);
  columns.push(column2);
  columns.push(column3);
  // Create chart
  var chart = c3.generate({
    bindto: '#chart',
    tooltip: {
      format: {
        value: function(x) {
          return '$' + x.toFixed(2);
        }
      }
    },
    data: {
      columns: columns,
      /*
      columns: [
        ['data1', 30, 200, 100, 400, 150, 250],
        ['data2', 130, 100, 140, 200, 150, 50]
      ],
      */
      type: 'spline'
    },
    grid: {
      y: {
        show: true
      }
    },
    zoom: {
      enabled: false
    },
    axis: {
      x: {
        tick: {
          format: function(x) {
            return x + 1;
          }
        }
      },
      y: {
        tick: {
          format: d3.format('$,')
        }
      }
    }
  });
})

/**
 * Add Transaction
 */
.controller('TransactionAddCtrl', function TransactionAddCtrl($scope, $state, $stateParams, Messages, $http, User) {
  $scope.transaction = {
    description: '',
    amount: '',
    date: moment().format('YYYY-MM-DD HH:mm:ss')
  };
  $scope.save = function(valid, transaction) {
    $scope.addTransaction.submitted = true;
    if (valid) {
      $http({method: 'POST', url: 'http://myfedha.com/api/transaction', data:JSON.stringify(transaction)}).
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
.controller('TransactionEditCtrl', function TransactionAddCtrl($scope, $state, $stateParams, Messages, $http, User) {
  $scope.transaction = {
    description: '',
    amount: '',
    date: ''
  };

  $http({method: 'GET', url: 'http://myfedha.com/api/transaction/'+$stateParams.id}).
    success(function(data, status, headers, config) {
      $scope.transaction = data;
    }).
    error(function(data, status, headers, config) {
      alert('Error');
    });

  $scope.save = function(valid, transaction) {
    if (valid) {
      $http({method: 'PUT', url: 'http://myfedha.com/api/transaction/'+$stateParams.id, data:JSON.stringify(transaction)}).
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
    $http({method: 'DELETE', url: 'http://myfedha.com/api/transaction/'+$stateParams.id}).
      success(function(data, status, headers, config) {
        Messages.addMessage('Transaction deleted successfully!');
        $state.go('app.transaction');
      }).
      error(function(data, status, headers, config) {
        alert('Error');
      });
  };
})

;
