var TransactionModel = require('/var/www/myfedha.com/src/js/transaction/model/TransactionModel.js');

describe('A TransactionModel', function() {
  it('contains a TransactionModel', function() {
    expect(TransactionModel).toBeDefined();
  });

  it('has a method to find all transactions', function(){

    var transaction = new TransactionModel();

    console.log(transaction);

    expect(transaction.find().length).toBeGreaterThan(0);
  });
});
