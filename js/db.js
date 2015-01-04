/**
 * @todo figure out how to throw exceptions well
 */
angular.module('myfedha-db', [])

.factory('Marylin', function(){
  return window.Marilyn;
})

/**
 * The database abstraction layer.
 */
.factory('DBAL', function DBAL($q, Marylin){
  var models = {};

  // Get a model.
  var getModel = function getModel(modelName) {
    // If it doesn't exist, create it.
    if (typeof(models[modelName])=='undefined') {
      var model = Marilyn.model(modelName);
      setModel(modelName, model);
    }
    return models[modelName];
  };

  // Set a model.
  var setModel = function setModel(modelName, model) {
    models[modelName] = model;
  };

  // Internal method: getNextId.
  var getNextId = function getNextId(collectionName) {
    // @todo use an actual identifier somehow
    for (var c = ''; c.length < 32;) {
      c += Math.random().toString(36).substr(2, 1)
    }
    return c;
  };

  return {
    findAll: function(modelName) {
      var deferred = $q.defer();

      // Get the model.
      var model = getModel(modelName);

      // Get the collection.
      model.read(function(err, results){
        if (!err) {
          deferred.resolve(results);
        } else {
          console.log('Could not retrieve data for ' + modelName + '.');
          throw 'Could not retrieve data for ' + modelName + '.';
          deferred.resolve([]);
        }
      });

      return deferred.promise;
    },
    find: function(modelName, id) {
      var deferred = $q.defer();

      // Get the record.
      var model = getModel(modelName);
      model.readOne({id:id}, function(err, result){
        if (!err && result) {
          deferred.resolve(result);
        } else {
          console.log('Could not retrieve data for id ' + id + ' in ' + modelName + '.');
          throw 'Could not retrieve data for id ' + id + ' in ' + modelName + '.';
          deferred.resolve({});
        }
      });

      return deferred.promise;
    },
    save: function(modelName, data) {
      var deferred = $q.defer();

      // Set the id if it doesn't have one.
      if (typeof(data.id) == 'undefined') {
        data.id = getNextId(modelName);
      }

      // Get a model version of the data.
      var model = getModel(modelName);
      data = new model(data);

      // Persist the data.
      data.save(function(err, result){
        if (err) {
          console.log('Could not create record in ' + modelName + '.');
          throw 'Could not create record in ' + modelName + '.';
          deferred.resolve({});
        } else {
          deferred.resolve(result);
        }
      });

      return deferred.promise;
    },
    delete: function(modelName, data) {
      var deferred = $q.defer();

      // Set the id if it doesn't have one.
      if (typeof(data.id) == 'undefined') {
        console.log('There must be an id on something you want to delete in ' + modelName);
        throw 'There must be an id on something you want to delete in ' + modelName;
      }

      // Get a model version of the data.
      var model = getModel(modelName);
      data = new model(data);

      // Persist the data.
      data.del({id:data.id}, function(err, result){
        if (err) {
          console.log('Could not delete record in ' + modelName + '.');
          throw 'Could not delete record in ' + modelName + '.';
          deferred.resolve({});
        } else {
          deferred.resolve(result);
        }
      });

      return deferred.promise;
    }
  };
})

;
