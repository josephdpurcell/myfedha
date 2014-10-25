moment.fn.between = function(other) {
    var display = '';
    if (this.isAfter(other)) {
        // this is after other
    } else {
        // this is before other
        var day = this.date();
        var month = this.month();
        var year = this.year();
        if (other.year() != year) {
            console.log('Need to test year in "between" fn.');
            // Print the range of days and months and years
            display = this.format('MMM DD, YYYY') + ' to ' + other.format('MMM DD, YYYY');
        } else if (other.month() != month) {
            // Print the range of days and months
            display = this.format('MMM DD') + ' to ' + other.format('MMM DD, YYYY');
        } else if (other.date() != day) {
            // Print the range of days
            display = this.format('MMM DD') + ' to ' + other.format('DD, YYYY');
        } else {
            // Print the day
            display = this.format('MMM DD, YYYY');
        }
    }
    return display;
};

/**
 * @todo: Design a pager that is a daterange that can be +/-
 * @todo: Add goals that are tied to a daterange.
 */
angular.module('myfedha', [
  'ui.router',
  'LocalForageModule',
  //'cfp.hotkeys'
])

/**
 * App Configuration
 */
.config(function appConfig($stateProvider, $urlRouterProvider, $httpProvider, $localForageProvider) {

  $localForageProvider.config({
    //driver      : 'localStorageWrapper', // if you want to force a driver
    name        : 'myfedha', // name of the database and prefix for your data
    version     : 1.0, // version of the database, you shouldn't have to use this
    storeName   : 'myfedha', // name of the table
    description : 'MyFedha for budgeting!'
  });

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
    },
    resolve: {
    /*
      keys: function(hotkeys, $state) {
        // Budgeting shortcuts.
        hotkeys.add({
          combo: 'g b',
          description: 'Go to budget.',
          callback: function() {
            $state.go('app.budget');
          }
        });
        hotkeys.add({
          combo: 'n b',
          description: 'Add a budget transaction.',
          callback: function() {
            $state.go('app.budget.add');
          }
        });
        // Accounts shortcuts.
        hotkeys.add({
          combo: 'g a',
          description: 'Go to accounts.',
          callback: function() {
            $state.go('app.account');
          }
        });
        // Transaction shortcuts.
        hotkeys.add({
          combo: 'g t',
          description: 'Go to list of transactions.',
          callback: function() {
            $state.go('app.transaction');
          }
        });
        hotkeys.add({
          combo: 'n t',
          description: 'Add a transaction.',
          callback: function() {
            $state.go('app.transaction.add');
          }
        });
      },
      */
      User: function(UserProvider, $q) {
        var deferred = $q.defer();
        UserProvider.provideUser(function(User){
          deferred.resolve(User);
        });
        return deferred.promise;
      },
      accountData: function($http, $q, User){
        var deferred = $q.defer();
        $http({method: 'GET', url: 'http://myfedha.com/api/account', headers:{Authorization:"OAuth "+User.access_token}}).
          success(function(data, status, headers, config) {
            var accountData = {
              title: 'Accounts',
              accounts: data
            };
            deferred.resolve(accountData);
          }).
          error(function(data, status, headers, config) {
            alert('Error');
            deferred.resolve(false);
          });
        return deferred.promise;
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

  // Logout
  $stateProvider.state( 'app.logout', {
    url: 'logout',
    views: {
      'app@': {
        templateUrl: '/js/logout.tpl.html'
      }
    },
    resolve: {
      logoutAction: function(User, $q) {
        var deferred = $q.defer();
        User.logout(function(){
          deferred.resolve(true);
        });
        return deferred.promise;
      }
    }
  });

  // Budget landing page
  $stateProvider.state( 'app.budget', {
    url: 'budget/:index',
    views: {
      'app@': {
        templateUrl: '/js/budget.tpl.html',
        controller: 'BudgetCtrl'
      }
    },
    resolve: {
      budgetData: function($http, $q, User, $stateParams){
        var deferred = $q.defer();

        // a "page" is 2 weeks
        var pageDefinition = {
            amount: 2,
            unit: 'weeks'
        };

        // set today
        var today = moment();

        // set today period (the page period for today)
        // iterator will be the end of the current period and will start from
        // the first known end of period
        var iterator = moment('2014-10-03').recur().every(2).weeks();
        var todayPeriodEnd = iterator.next(1, 'L')[0];
        while (today.isAfter(todayPeriodEnd)) {
            iterator = iterator.fromDate(todayPeriodEnd);
            todayPeriodEnd = iterator.next(1, 'L')[0];
        }
        // convert today period end to moment js
        todayPeriodEnd = moment(todayPeriodEnd);
        todayPeriodStart = moment(todayPeriodEnd);
        todayPeriodStart.subtract(pageDefinition.amount, pageDefinition.unit);
        console.log('today period start', todayPeriodStart.format('L'));
        console.log('today period end', todayPeriodEnd.format('L'));

        // set pageday ("today" + however many days we page for)
        var pageday = moment();
        var index = $stateParams.index ? $stateParams.index : 0;
        if (index>0) {
            // go into the fiture
            pageday.add(pageDefinition.amount * index, pageDefinition.unit);
        } else if (index<0) {
            // go back in time
            pageday.subtract(pageDefinition.amount * index * -1, pageDefinition.unit);
        }

        // set pageday period (the page period for pageday)
        var iterator = moment('2014-10-03').recur().every(2).weeks();
        var pagedayPeriodEnd = iterator.next(1, 'L')[0];
        while (pageday.isAfter(pagedayPeriodEnd)) {
            iterator = iterator.fromDate(pagedayPeriodEnd);
            pagedayPeriodEnd = iterator.next(1, 'L')[0];
        }
        // convert pageday period end to moment js
        pagedayPeriodEnd = moment(pagedayPeriodEnd);
        pagedayPeriodStart = moment(pagedayPeriodEnd);
        pagedayPeriodStart.subtract(pageDefinition.amount, pageDefinition.unit);
        console.log('pageday period start', pagedayPeriodStart.format('L'));
        console.log('pageday period end', pagedayPeriodEnd.format('L'));


        // Make request
        $http({method: 'GET', url: 'http://myfedha.com/api/budget', params:{start:todayPeriodStart.unix(),end:pagedayPeriodEnd.unix()}, headers:{Authorization:"OAuth "+User.access_token}}).
          success(function(data, status, headers, config) {
            var budgetData = {
              title: pagedayPeriodStart.between(pagedayPeriodEnd),
              today: today,
              pageday: pageday,
              todayPeriodStart: todayPeriodStart,
              todayPeriodEnd: todayPeriodEnd,
              pagedayPeriodStart: pagedayPeriodStart,
              pagedayPeriodEnd: pagedayPeriodEnd,
              transactions: data
            };
            deferred.resolve(budgetData);
          }).
          error(function(data, status, headers, config) {
            alert('Error');
            deferred.resolve(false);
          });
        return deferred.promise;
      }
    }
  });

  // Add
  $stateProvider.state( 'app.budget.add', {
    url: '/add',
    views: {
      'app@': {
        templateUrl: '/js/budget_add.tpl.html',
        controller: 'BudgetAddCtrl'
      }
    }
  });

  // Edit
  $stateProvider.state( 'app.budget.edit', {
    url: '/:id/edit',
    views: {
      'app@': {
        templateUrl: '/js/budget_edit.tpl.html',
        controller: 'BudgetEditCtrl'
      }
    }
  });

  // Account landing page
  $stateProvider.state( 'app.account', {
    url: 'account',
    views: {
      'app@': {
        templateUrl: '/js/account.tpl.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // Add
  $stateProvider.state( 'app.account.add', {
    url: '/add',
    views: {
      'app@': {
        templateUrl: '/js/account_add.tpl.html',
        controller: 'AccountAddCtrl'
      }
    }
  });

  // Edit
  $stateProvider.state( 'app.account.edit', {
    url: '/:id/edit',
    views: {
      'app@': {
        templateUrl: '/js/account_edit.tpl.html',
        controller: 'AccountEditCtrl'
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
    },
    resolve: {
      transactionData: function($http, $q, User){
        var deferred = $q.defer();
        var start = moment().startOf('month').unix();
        var end = moment().endOf('month').unix();
        $http({method: 'GET', url: 'http://myfedha.com/api/transaction', params:{start:start,end:end}, headers:{Authorization:"OAuth "+User.access_token}}).
          success(function(data, status, headers, config) {
            var transactionData = {
              title: moment().format('MMMM YYYY'),
              transactions: [],
              total: 0,
              goal: 400,
              goalPerDay: 0,
              goalToday: 0,
              trending: 0,
              daysInMonth: moment().endOf('month').format('D'),
              dayOfMonth: moment().format('D')
            };
            // Get total.
            var value = 0;
            for (var i in data) {
              data[i].amount = parseFloat(data[i].amount);
              if (data[i].amount) {
                transactionData.total = transactionData.total + data[i].amount;
              }
            }
            // Calculate goal.
            transactionData.goalPerDay = Math.round(transactionData.goal / transactionData.daysInMonth * 100) / 100;
            transactionData.goalToday = transactionData.goalPerDay * moment().format('D');
            transactionData.trending = transactionData.total / transactionData.goalToday * 100;
            transactionData.transactions = data;
            deferred.resolve(transactionData);
          }).
          error(function(data, status, headers, config) {
            alert('Error');
            deferred.resolve(false);
          });
        return deferred.promise;
      }
    }
  });

  // Transactions as a graph
  $stateProvider.state( 'app.transaction.graph', {
    url: '/graph',
    views: {
      'transaction-body': {
        templateUrl: '/js/transaction_graph.tpl.html',
        controller: 'TransactionGraphCtrl'
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
 * Sum filter
 * Source: http://stackoverflow.com/a/23843367
 */
.filter('sumFilter', function() {
  return function(transactions) {
    var total = 0;
    for (var i in transactions) {
      total += parseFloat(transactions[i].amount);
    };
    return total;
  }
})

.filter('sumBudgetFilter', function() {
  return function(transactions) {
    var total = 0;
    for (var i in transactions) {
      if (transactions[i].type=='expense') {
        total -= parseFloat(transactions[i].amount);
      } else {
        total += parseFloat(transactions[i].amount);
      }
    };
    return total;
  }
})

.filter('sumFilterEstimate', function() {
  return function(transactions) {
    var total = 0;
    for (var i in transactions) {
      if (transactions[i].type=='expense') {
        total -= parseFloat(transactions[i].estimate);
      } else {
        total += parseFloat(transactions[i].estimate);
      }
    };
    return total;
  }
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
 * A User provider
 */
.factory('UserProvider', function UserProvider($localForage){
  return {
    provideUser: function(callback){
      var User = {
        init: function(callback){
            this.getAccessToken(callback);
        },
        logout: function(callback){
          this.name = '';
          this.access_token = '';
          $localForage.removeItem('access_token').then(function(){
            if (typeof callback == 'function') {
              callback(true);
            }
          });
        },
        name: '',
        access_token: '',
        getAccessToken: function(callback){
          var that = this;
          if (!that.access_token) {
            $localForage.getItem('access_token').then(function(access_token){
              that.access_token = access_token;
              if (typeof callback == 'function') {
                callback(access_token);
              }
            });
          } else {
            callback(that.access_token);
          }
        },
        setAccessToken: function(access_token, callback){
          this.access_token = access_token;
          $localForage.setItem('access_token', access_token).then(callback);
          return this;
        }
      };
      User.init(function(){
        callback(User);
      });
    }
  };
})

/**
 * The Main App Controller
 *
 * Note: this sort of acts like a global scope
 */
.controller('AppCtrl', function AppCtrl(){
  // nothing here yet
})

/**
 * Login
 */
.controller('LoginCtrl', function LoginCtrl($scope, $state, $http, User){
  $scope.user = {
    username: '',
    password: ''
  };
  if (User.access_token) {
    alert('We already have an access token');
    $state.go('app.transaction');
  }
  $scope.login = function(valid, user){
    $http({method: 'POST', url: 'http://myfedha.com/api/authenticate', data:{username:user.username, password:user.password}}).
      success(function(data, status, headers, config) {
        User.setAccessToken(data.access_token, function(){
          $state.go('app.transaction');
        });
      }).
      error(function(data, status, headers, config) {
        alert(data.message);
      });
  };
})

/**
 * Budget
 */
.controller('BudgetCtrl', function BudgetCtrl($scope, $state, $http, User, budgetData, accountData){
  $scope.getAccountName = function(account_id) {
    var name = '';
    for (var i in $scope.accounts) {
      if ($scope.accounts[i].id==account_id) {
        name = $scope.accounts[i].description;
      }
    }
    return name;
  };

  $scope.edit = function(id){
    $state.go('app.budget.edit', {id:id});
  };
  $scope.editAccount = function(id){
    $state.go('app.account.edit', {id:id});
  };
  $scope.pay = function(t) {
    var transaction = angular.copy(t);
    transaction.amount = transaction.estimate;
    $http({method: 'PUT', url: 'http://myfedha.com/api/budget/'+t.id, data:JSON.stringify(transaction), headers:{Authorization:"OAuth "+User.access_token}}).
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
  $scope.title = budgetData.title;
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
            console.log('yes');
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
      $http({method: 'POST', url: 'http://myfedha.com/api/budget', data:JSON.stringify(transaction), headers:{Authorization:"OAuth "+User.access_token}}).
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
      $http({method: 'PUT', url: 'http://myfedha.com/api/budget/'+$stateParams.id, data:JSON.stringify(transaction), headers:{Authorization:"OAuth "+User.access_token}}).
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
    $http({method: 'DELETE', url: 'http://myfedha.com/api/budget/'+$stateParams.id, headers:{Authorization:"OAuth "+User.access_token}}).
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

/**
 * Account
 */
.controller('AccountCtrl', function AccountCtrl($scope, $state, $http, User, accountData){
  $scope.edit = function(id){
    $state.go('app.account.edit', {id:id});
  };
  $scope.title = accountData.title;
  $scope.accounts = accountData.accounts;
})

/**
 * Add Account
 */
.controller('AccountAddCtrl', function AccountAddCtrl($scope, $state, $stateParams, Messages, $http, User, accountData) {
  $scope.transaction = {
    description: '',
    amount: ''
  };
  $scope.save = function(valid, account) {
    $scope.addAccount.submitted = true;
    if (valid) {
      $http({method: 'POST', url: 'http://myfedha.com/api/account', data:JSON.stringify(account), headers:{Authorization:"OAuth "+User.access_token}}).
        success(function(data, status, headers, config) {
          Messages.addMessage('Account added successfully!');
          accountData.accounts.push(data);
          $state.go('app.account');
        }).
        error(function(data, status, headers, config) {
          alert('Error');
        });
    }
  };
})

/**
 * Edit Account
 */
.controller('AccountEditCtrl', function AccountAddCtrl($scope, $state, $stateParams, Messages, $http, User, accountData) {
  $scope.account = {
    description: '',
    amount: ''
  };

  var index = 0;
  for (var i in accountData.accounts) {
    if (accountData.accounts[i].id == $stateParams.id) {
      index = i;
      angular.copy(accountData.accounts[i], $scope.account);
      break;
    }
  }

  $scope.save = function(valid, account) {
    if (valid) {
      $http({method: 'PUT', url: 'http://myfedha.com/api/account/'+$stateParams.id, data:JSON.stringify(account), headers:{Authorization:"OAuth "+User.access_token}}).
        success(function(data, status, headers, config) {
          Messages.addMessage('Account updated successfully!');
          accountData.accounts[index] = $scope.account;
          $state.go('app.account');
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

  $scope.delete = function(account) {
    $http({method: 'DELETE', url: 'http://myfedha.com/api/account/'+$stateParams.id, headers:{Authorization:"OAuth "+User.access_token}}).
      success(function(data, status, headers, config) {
        Messages.addMessage('Account deleted successfully!');
        accountData.accounts.splice(index, 1);
        $state.go('app.account');
      }).
      error(function(data, status, headers, config) {
        alert('Error');
      });
  };
})

/**
 * Transaction
 */
.controller('TransactionCtrl', function TransactionCtrl($scope, $state, $http, User, transactionData){
  $scope.edit = function(id){
    $state.go('app.transaction.edit', {id:id});
  };
  $scope.title = transactionData.title;
  $scope.goal = transactionData.goal;
  $scope.goalPerDay = transactionData.goalPerDay;
  $scope.goalToday = transactionData.goalToday;
  $scope.transactions = transactionData.transactions;
  $scope.total = transactionData.total;
  $scope.trending = transactionData.trending;
  $scope.dayOfMonth = transactionData.dayOfMonth;
  $scope.daysInMonth = transactionData.daysInMonth;

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
      $http({method: 'POST', url: 'http://myfedha.com/api/transaction', data:JSON.stringify(transaction), headers:{Authorization:"OAuth "+User.access_token}}).
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

  $http({method: 'GET', url: 'http://myfedha.com/api/transaction/'+$stateParams.id, headers:{Authorization:"OAuth "+User.access_token}}).
    success(function(data, status, headers, config) {
      $scope.transaction = data;
    }).
    error(function(data, status, headers, config) {
      alert('Error');
    });

  $scope.save = function(valid, transaction) {
    if (valid) {
      $http({method: 'PUT', url: 'http://myfedha.com/api/transaction/'+$stateParams.id, data:JSON.stringify(transaction), headers:{Authorization:"OAuth "+User.access_token}}).
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
    $http({method: 'DELETE', url: 'http://myfedha.com/api/transaction/'+$stateParams.id, headers:{Authorization:"OAuth "+User.access_token}}).
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
