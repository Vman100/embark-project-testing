// /*global contract, config, it, assert*/

const TipJar = require('Embark/contracts/TipJar');

let accounts;

// For documentation please see https://embark.status.im/docs/contracts_testing.html
config({
  //deployment: {
  //  accounts: [
  //    // you can configure custom accounts with a custom balance
  //    // see https://embark.status.im/docs/contracts_testing.html#Configuring-accounts
  //  ]
  //},
  contracts: {
    TipJar: {}
  }
}, (_err, web3_accounts) => {
  accounts = web3_accounts
});

contract("TipJar", function () {
  this.timeout(0);
  
  before(async function() {
    accounts = await web3.eth.getAccounts();
  });

  it("get owner address", async function () {
    let result = await TipJar.methods.showOwner().call();
    assert.equal(result, accounts[0]);
  });

  it("change owner address", async function () {
    let result = await TipJar.methods.changeOwner(accounts[1]).send();
    let log = result.events.logOwnerChange;
    assert.notEqual(log.returnValues[0], log.returnValues[1]);
  });

  it("Withdraw form TipJar", async function () {
    let result = await TipJar.methods.withdraw().send({from: accounts[1]});
    assert.ok(result);
  });

})
