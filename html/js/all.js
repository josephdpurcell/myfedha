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
      user: function(User, $q) {
        var deferred = $q.defer();
        User.init(function(){
          deferred.resolve(true);
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
 * A User
 */
.factory('User', function User($localForage){
  return {
    init: function(callback){
        this.getAccessToken(callback);
    },
    name: '',
    access_token: '',
    getAccessToken: function(callback){
      var that = this;
      if (!that.access_token) {
        $localForage.getItem('access_token').then(function(access_token){
          access_token = '641414384cc4b2931d28d8b791ddb69f';
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
.controller('LoginCtrl', function LoginCtrl($scope, $state, $http, User){
  $scope.user = {
    username: '',
    password: ''
  };
  User.getAccessToken(function(access_token){
    if (access_token) {
      alert('We already have an access token');
      $state.go('app.transaction');
    }
    $scope.login = function(valid, user){
      $http({method: 'POST', url: '/api/authenticate', data:{username:user.username, password:user.password}}).
        success(function(data, status, headers, config) {
          User.setAccessToken(data.access_token, function(){
            $state.go('app.transactions');
          });
        }).
        error(function(data, status, headers, config) {
          alert(data.message);
        });
    };
  });
})

/**
 * Transaction
 */
.controller('TransactionCtrl', function TransactionCtrl($scope, $state, $http, User){
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
  $http({method: 'GET', url: '/api/transaction', params:{start:start,end:end}, headers:{Authorization:"OAuth "+User.access_token}}).
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
