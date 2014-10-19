/**
 * @todo: Design a pager that is a daterange that can be +/-
 * @todo: Add goals that are tied to a daterange.
 */
angular.module('myfedha', [
  'ui.router',
  'LocalForageModule',
  'cfp.hotkeys'
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
      keys: function(hotkeys, $state) {
        hotkeys.add({
          combo: 'a',
          description: 'Add a transaction.',
          callback: function() {
            $state.go('app.transaction.add');
          }
        });
      },
      User: function(UserProvider, $q) {
        var deferred = $q.defer();
        UserProvider.provideUser(function(User){
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
        $http({method: 'GET', url: '/api/transaction', params:{start:start,end:end}, headers:{Authorization:"OAuth "+User.access_token}}).
          success(function(data, status, headers, config) {
            var transactionData = {
              title: moment().format('MMMM YYYY'),
              transactions: data,
              total: 0,
              goal: 400,
              goalPerDay: 0,
              goalToday: 0,
              trending: 0
            };
            // Get total.
            var value = 0;
            for (var i in data) {
              value = parseFloat(data[i].amount);
              if (value) {
                transactionData.total = transactionData.total + value;
              }
            }
            // Calculate goal.
            var daysInMonth = moment().endOf('month').format('D');
            transactionData.goalPerDay = Math.round(transactionData.goal / daysInMonth * 100) / 100;
            transactionData.goalToday = transactionData.goalPerDay * moment().format('D');
            transactionData.trending = transactionData.total / transactionData.goalToday * 100;
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
    $http({method: 'POST', url: '/api/authenticate', data:{username:user.username, password:user.password}}).
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
  var daysInMonth = moment().endOf('month').format('D');
  var daysIntoMonth = moment().format('D');
  var avg = $scope.total / daysIntoMonth;
  for (var day=1; day<=daysInMonth; day++) {
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
      $http({method: 'POST', url: '/api/transaction', data:JSON.stringify(transaction), headers:{Authorization:"OAuth "+User.access_token}}).
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

  $http({method: 'GET', url: '/api/transaction/'+$stateParams.id, headers:{Authorization:"OAuth "+User.access_token}}).
    success(function(data, status, headers, config) {
      $scope.transaction = data;
    }).
    error(function(data, status, headers, config) {
      alert('Error');
    });

  $scope.save = function(valid, transaction) {
    if (valid) {
      $http({method: 'PUT', url: '/api/transaction/'+$stateParams.id, data:JSON.stringify(transaction), headers:{Authorization:"OAuth "+User.access_token}}).
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
    $http({method: 'DELETE', url: '/api/transaction/'+$stateParams.id, headers:{Authorization:"OAuth "+User.access_token}}).
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
