/**
 * The DatabaseDriver Interface.
 *
 * JavaScript doesn't have interfaces, but this will hopefully help document
 * what a DatabaseDriver needs to implement.
 */
var DatabaseDriver = function DatabaseDriver(){
  this.get = function(key){};
  this.save = function(key, entity){};
  this.remove = function(key){};
};

module.exports = function(dependencies) {
  console.log('dbdriver deps', dependencies);
  return DatabaseDriver;
};
