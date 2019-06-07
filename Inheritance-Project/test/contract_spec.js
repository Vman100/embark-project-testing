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
    assert.strictEqual(result, accounts[0]);
  });

  it("any user can send tips", async function () {
    let oldTipJarBalance = await web3.eth.getBalance(TipJar.address)
    await web3.eth.sendTransaction({
      from: accounts[2], 
      to: TipJar.address, 
      value: web3.utils.toWei('2', 'ether')
    });
    let newTipJarBalance = await web3.eth.getBalance(TipJar.address)
    assert.notStrictEqual(oldTipJarBalance, newTipJarBalance);
  })

  it("owner can change owner address", async function () {
    let result = await TipJar.methods.changeOwner(accounts[1]).send();
    let log = result.events.logOwnerChange;
    assert.notStrictEqual(log.returnValues[0], log.returnValues[1]);
  });


  it("non-owner cannot change owner address", async function () {
    try {
      await TipJar.methods.changeOwner(accounts[1]).send();
    } catch (error) {
      assert.ok(didRevertCorrectly(error.message,expectedErrorMessages["owner"]))
    }
  });

  it("owner can withdraw from TipJar", async function () {
    let oldTipJarBalance = await web3.eth.getBalance(TipJar.address)
    await TipJar.methods.withdraw().send({from: accounts[1]});
    let newTipJarBalance = await web3.eth.getBalance(TipJar.address)
    assert.notStrictEqual(oldTipJarBalance, newTipJarBalance);
  });

  it("non-owner cannot withdraw from TipJar", async function () {
    try {
    await TipJar.methods.withdraw().send();
  } catch (error) {
    assert.ok(didRevertCorrectly(error.message,expectedErrorMessages["owner"]))
  }
  });
})
