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
  
  it("get owner address", async function () {
    let result = await TipJar.methods.showOwner().call();
    assert.ok(result);
  });
})
