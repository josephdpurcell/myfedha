angular.module('myfedha-account', [
  'ui.router',
  'myfedha-api'
])

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
      $http({method: 'POST', url: 'http://myfedha.com/api/account', data:JSON.stringify(account)}).
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
      $http({method: 'PUT', url: 'http://myfedha.com/api/account/'+$stateParams.id, data:JSON.stringify(account)}).
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
    $http({method: 'DELETE', url: 'http://myfedha.com/api/account/'+$stateParams.id}).
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

;
