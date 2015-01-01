angular.module('myfedha-db', [
  'LocalForageModule'
])

/**
 * Configure each of our local forage tables here.
 *
 * @todo move this to a provider and require the dev to create the table
 * manually before calling LocalForageContainer.provide
 */
.run(function($localForage){
  $localForage.createInstance({
    //driver      : 'localStorageWrapper', // if you want to force a driver
    name        : 'myfedha_transactions', // name of the database and prefix for your data
    version     : 1.0, // version of the database, you shouldn't have to use this
    storeName   : 'transactions', // name of the table
    description : 'MyFedha for budgeting!'
  });
})

/**
 * The provider of local forage tables.
 */
.factory('LocalForageContainer', function ($localForage){
  return {
    provide: function provide(table) {
      return $localForage.instance('myfedha_' + table);
    }
  };
})

/**
 * The database abstraction layer.
 */
.factory('DBAL', function DBAL(LocalForageContainer, $q){
    var collections = {}
    return {
      getNextId: function(table){
        // @todo use an actual identifier somehow
        for (var c = ''; c.length < 32;) {
          c += Math.random().toString(36).substr(2, 1)
        }
        return c;
      },
      findAll: function(table) {
        if (typeof(collections[table])!='undefined') {
          return collections[table]
        } else {
          var deferred = $q.defer();
          var db = LocalForageContainer.provide(table);
          db.keys().then(function(keys){
            var counter = 0;
            var total = keys.length;
            var data = [];
            for (var i in keys) {
              db.getItem(keys[i]).then(function(obj){
                // @todo clean this up; async promise?
                counter++;
                data.push(obj)
                if (counter == total) {
                  collections[table] = data
                  deferred.resolve(data);
                }
              });
            }
          });
          return deferred.promise;
        }
      },
      find: function(table, key) {
        var deferred = $q.defer();
        var db = LocalForageContainer.provide(table);
        return db.getItem(key);
      },
      save: function(table, data) {
        var deferred = $q.defer();
        var db = LocalForageContainer.provide(table);
        var isNew = (typeof(data.id) == 'undefined');
        if (isNew) {
          data.id = this.getNextId(table);
        }
        db.setItem(data.id, data).then(function(){
          if (typeof(collections[table])!='undefined') {
            if (isNew) {
              collections[table].push(data)
            } else {
              for (var i in collections[table]) {
                if (collections[table][i].id == data.id) {
                  collections[table][i] = data
                  break;
                }
              }
            }
          }
          deferred.resolve();
        });
        return deferred.promise;
      }
    };
})

;
