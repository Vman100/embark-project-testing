// /*global contract, config, it, assert*/

const TipJar = require('Embark/contracts/TipJar');

function didRevertCorrectly(actualError, expectedError) {
  return actualError.includes(expectedError);
}

let expectedErrorMessages = {
  "owner": "caller is not owner"
}

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
    assert.equal(result, accounts[0]);
  });

  it("owner can change owner address", async function () {
    let result = await TipJar.methods.changeOwner(accounts[1]).send();
    let log = result.events.logOwnerChange;
    assert.notEqual(log.returnValues[0], log.returnValues[1]);
  });


  it("non-owner cannot change owner address", async function () {
    try {
      await TipJar.methods.changeOwner(accounts[1]).send();
    } catch (error) {
      assert.ok(didRevertCorrectly(error.message,expectedErrorMessages["owner"]))
    }
  });

  it("owner can withdraw from TipJar", async function () {
    let result = await TipJar.methods.withdraw().send({from: accounts[1]});
    assert.ok(result);
  });

  it("non-owner cannot withdraw from TipJar", async function () {
    try {
    await TipJar.methods.withdraw().send();
  } catch (error) {
    assert.ok(didRevertCorrectly(error.message,expectedErrorMessages["owner"]))
  }
  });

})
