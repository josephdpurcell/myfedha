angular.module('myfedha-api', [
  'LocalForageModule'
])

.config(function appConfig($httpProvider, $localForageProvider) {

  $localForageProvider.config({
    //driver      : 'localStorageWrapper', // if you want to force a driver
    name        : 'myfedha', // name of the database and prefix for your data
    version     : 1.0, // version of the database, you shouldn't have to use this
    storeName   : 'myfedha', // name of the table
    description : 'MyFedha for budgeting!'
  });

  $httpProvider.interceptors.push('interceptor403');

  $httpProvider.interceptors.push('httpRequestInterceptor');

})

/*
.run(function run($rootScope, User){
  User.then(function(User){
    $rootScope.User = User;
  });
})
*/

.factory('interceptor403', function interceptor403($q){
  return {
    responseError: function(response) {
      if (response.status == 403) {
        window.location = "#/login";
        return;
      }
      return $q.reject(response);
    }
  };
})

.factory('httpRequestInterceptor', function httpRequestInterceptor($q, UserProvider) {
  return {
    request: function (config) {
      var deferred = $q.defer();
      UserProvider.provideUser(function(User){
        config.headers['Authorization'] = 'OAuth ' + User.access_token;
        deferred.resolve(config);
      });
      return deferred.promise;
    }
  };

})

.provider('api', function api(){
  return {
    $get: function get($q, UserProvider){

      return {
        logout: function logout() {
          var deferred = $q.defer();
          UserProvider.provideUser(function(User){
            User.logout(function(){
              deferred.resolve(true);
            });
          });
          return deferred.promise;
        },
        getUser: function getUser() {
          var deferred = $q.defer();
          UserProvider.provideUser(function(User){
            deferred.resolve(User);
          });
          return deferred.promise;
        }
      };

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

/*
.factory('API', function($http){


        $http({method: 'GET', url: 'http://myfedha.com/api/budget', params:{start:start.unix(),end:todayPeriodEnd.unix()}, headers:{Authorization:"OAuth "+User.access_token}}).
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

;
*/

;
