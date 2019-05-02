/*
var Underscore = require('/var/www/myfedha.com/src/vendor/underscore/underscore.js');

var Utils = require('/var/www/myfedha.com/src/js/Utils.js').Utils(Underscore);
*/

var DatabaseDriver = require('/var/www/myfedha.com/src/js/transaction/model/DatabaseDriver.js');

var RuntimeDatabase = require('/var/www/myfedha.com/src/js/transaction/model/RuntimeDatabase.js')(DatabaseDriver);

/*
describe('A RuntimeDatabase', function() {
  it('contains a RuntimeDatabase', function() {
    expect(RuntimeDatabase).toBeDefined();
  });

  it('can get an entity', function(){
    var db = new RuntimeDatabase();
    db.save(1, {});
    expect(db.get(1)).toBeDefined();
  });

  it('can save an entity', function(){
    var db = new RuntimeDatabase();
    db.save(1, {});
    expect(db.get(1)).toBeDefined();
  });
});
*/
