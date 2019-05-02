/**
 * A RuntimeDatabase.
 *
 * This is a runtime database useful for testing.
 */
var RuntimeDatabase = function RuntimeDatabase(config) {
  console.log('cfg', config);
  /*
  config = {
    collection: config.collection ? config.collection : {}
  };
  var collection = config.collection;
  */
  var collection = {};
  var that = this;

  this.get = function(key){
    return collection[key];
  };

  this.save = function(key, entity){
    collection[key] = entity;
    return that;
  };

  this.remove = function(key){
    unset(collection[key]);
    return that;
  };
};

module.exports = function(dependencies){
  console.log('dbdriver deps', dependencies);
  return RuntimeDatabase;
};
