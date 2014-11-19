/**
 * @todo: Design a pager that is a daterange that can be +/-
 * @todo: Add goals that are tied to a daterange.
 */
angular.module('myfedha', [
  'ui.router',
  'myfedha-api',
  'myfedha-transaction',
  'myfedha-budget',
  //'cfp.hotkeys'
])

/**
 * App Configuration
 */
.config(function appConfig($stateProvider, $urlRouterProvider) {

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
      User: function ($q, api) {
        var deferred = $q.defer();
        api.getUser().then(function(User){
          deferred.resolve(User);
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
    },
    resolve: {
      User: function ($q, api) {
        var deferred = $q.defer();
        api.getUser().then(function(User){
          deferred.resolve(User);
        });
        return deferred.promise;
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
      logoutAction: function (api) {
        return api.logout;
      }
    }
  });

  // Budget landing page
  $stateProvider.state( 'app.budget', {
    url: 'budget/:page',
    views: {
      'app@': {
        templateUrl: '/js/budget.tpl.html',
        controller: 'BudgetCtrl'
      }
    },
    resolve: {
      budgetData: function($http, $q, $stateParams){
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
        var todayPage = 1;
        while (today.isAfter(todayPeriodEnd)) {
            iterator = iterator.fromDate(todayPeriodEnd);
            todayPeriodEnd = iterator.next(1, 'L')[0];
            todayPage++;
        }
        // convert today period end to moment js
        todayPeriodEnd = moment(todayPeriodEnd);
        todayPeriodStart = moment(todayPeriodEnd);
        todayPeriodStart.subtract(pageDefinition.amount, pageDefinition.unit);
        console.log('today period start', todayPeriodStart.format('L'));
        console.log('today period end', todayPeriodEnd.format('L'));

        // set pageday ("today" + however many days we page for)
        //var pageday = moment();
        var pageday = moment('2014-10-03');
        var page = $stateParams.page ? parseInt($stateParams.page) : todayPage;
        if (page>0) {
            // go into the fiture
            pageday.add(pageDefinition.amount * page, pageDefinition.unit);
        } else if (page<0) {
            // go back in time
            pageday.subtract(pageDefinition.amount * page * -1, pageDefinition.unit);
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
        var start = moment('2014-10-03');
        $http({method: 'GET', url: 'http://myfedha.com/api/budget', params:{start:start.unix(),end:todayPeriodEnd.unix()}}).
          success(function(data, status, headers, config) {
            var budgetData = {
              title: pagedayPeriodStart.between(pagedayPeriodEnd),
              today: today,
              page: page,
              todayPage: todayPage,
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
      accountData: function($http, $q){
        var deferred = $q.defer();
        $http({method: 'GET', url: 'http://myfedha.com/api/account'}).
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
      },
      transactionData: function($http, $q){
        var deferred = $q.defer();
        var start = moment().startOf('month').unix();
        var end = moment().endOf('month').unix();
        $http({method: 'GET', url: 'http://myfedha.com/api/transaction', params:{start:start,end:end}}).
          success(function(transactions, status, headers, config) {
            // Convert dates to moment() and parseFloat amounts.
            for (var i in transactions) {
              transactions[i].dateObj = moment(transactions[i].date);
              transactions[i].amount = parseFloat(transactions[i].amount);
            }

            // Get today.
            var today = moment();

            // Compute the start of this week (but, not before beginning of month).
            var startOfMonth = moment().startOf('month');
            var startOfWeek = moment().startOf('week');
            if (startOfWeek.isBefore(startOfMonth)) {
                startOfWeek = moment(startOfMonth);
            }

            // Compute the end of this week (but, not after end of month).
            var endOfMonth = moment().endOf('month');
            var endOfWeek = moment().endOf('week');
            if (endOfWeek.isAfter(endOfMonth)) {
                endOfWeek = moment(endOfMonth);
            }


            // Goal per day
            // Goal per week
            // Goal per month
            var goalPerMonth = 500;
            var goalPerDay = goalPerMonth / endOfMonth.format('D');
            var goalPerWeek = 7 * goalPerDay;

            // how much I was supposed to spend today
            // how much I was supposed to spend this week
            // how much I was supposed to spend on this day of the month
            // how much I was supposed to spend this month
            var goalToday = goalPerDay;
            var goalThisDayOfWeek = goalPerDay * (parseFloat(today.format('D')) - parseFloat(startOfWeek.format('D')) + 1.0);
            var goalThisWeek = goalPerDay * (parseFloat(endOfWeek.format('D')) - parseFloat(startOfWeek.format('D')) + 1.0);
            var goalThisDayOfMonth = goalPerDay * (parseFloat(today.format('D')) - parseFloat(startOfMonth.format('D')) + 1.0);
            var goalThisMonth = goalPerMonth;

            // how much I spent today
            // how much I spent this week
            // how much I spent this month
            var spentToday = 0;
            var spentThisWeek = 0;
            var spentThisMonth = 0;
            for (var i in transactions) {
              if (transactions[i].amount) {
                if (transactions[i].dateObj.isAfter(startOfWeek) && transactions[i].dateObj.isBefore(endOfWeek)) {
                  spentThisWeek = spentThisWeek + transactions[i].amount;
                }
                if (transactions[i].dateObj.isSame(today, 'day')) {
                  spentToday = spentToday + transactions[i].amount;
                }
                spentThisMonth = spentThisMonth + transactions[i].amount;
              }
            }

            // trending over budget
            var trendingThisMonth = spentThisMonth / goalThisDayOfMonth * 100;

            // Set data to return.
            var transactionData = {
              title: moment().format('MMMM YYYY'),
              transactions: transactions,
              total: spentThisMonth,
              goal: goalThisMonth,
              trending: trendingThisMonth,
              daysInMonth: endOfMonth.format('D'),
              dayOfMonth: today.format('D'),

              goalPerMonth: goalPerMonth,
              goalPerDay: goalPerDay,
              goalPerWeek: goalPerWeek,
              goalToday: goalToday,
              goalThisDayOfWeek: goalThisDayOfWeek,
              goalThisWeek: goalThisWeek,
              goalThisDayOfMonth: goalThisDayOfMonth,
              goalThisMonth: goalThisMonth,
              spentToday: spentToday,
              spentThisWeek: spentThisWeek,
              spentThisMonth: spentThisMonth,
              trendingThisMonth: trendingThisMonth,
              trendingUnderBudget: trendingThisMonth <= 100
            };

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

;
