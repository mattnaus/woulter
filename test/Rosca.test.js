const Rosca = artifacts.require("Rosca");
const RoscaFactory = artifacts.require("RoscaFactory");

contract("RoscaFactory", async (accounts) => {
  let RoscaFactoryInstance;

  beforeEach(async () => {
    RoscaFactoryInstance = await RoscaFactory.deployed();
    await RoscaFactoryInstance.createRosca(1000, 5, "Testing :)");
    let addr = await RoscaFactoryInstance.deployedRoscas(0);
    RoscaInstance = await Rosca.at(addr);
  });

  it("Creates a Rosca contract", async () => {
    assert.ok(RoscaInstance.address);
  });

  it("Returns an array with all Rosca contracts", async () => {
    let roscas = await RoscaFactoryInstance.getDeployedRoscas();
    assert(Array.isArray(roscas));
    assert(roscas.length === 2);
  });
});

contract("Rosca", async (accounts) => {
  let RoscaFactoryInstance;
  let RoscaInstance;

  beforeEach(async () => {
    RoscaFactoryInstance = await RoscaFactory.deployed();
    RoscaInstance = await Rosca.new(1000, 5, accounts[0], "Testing circle :)");
  });

  it("Deploys a factory and Rosca contract", async () => {
    assert.ok(RoscaFactoryInstance.address);
    assert.ok(RoscaInstance.address);
  });

  it("Returns a correct Rosca summary", async () => {
    let summary = await RoscaInstance.getSummary();

    assert(summary.manager == accounts[0]);
    assert(summary.cycleContribution == 200);
    assert(summary.nrOfParticipants == 5);
  });

  it("Can have a new participant enter a contract", async () => {
    await RoscaInstance.enter({
      from: accounts[0],
      value: 200,
    });

    let firstAddress = await RoscaInstance.addresses(0);

    assert(firstAddress === accounts[0]);
  });

  it("Only accepts a new entry participants with the correct contribution", async () => {
    try {
      await RoscaInstance.enter({
        from: accounts[0],
        value: 100,
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("Increases the cycle's pool for a new participant", async () => {
    await RoscaInstance.enter({
      from: accounts[0],
      value: 200,
    });

    let cycle = await RoscaInstance.getCycle(0);

    assert(cycle[0] == 200);
    assert(cycle[1] == 1000);
    assert(!cycle[2]);
  });

  it("Will not allow to enter more than once", async () => {
    await RoscaInstance.enter({
      from: accounts[0],
      value: 200,
    });

    try {
      await RoscaInstance.enter({
        from: accounts[0],
        value: 200,
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("Won't allow contributions in the first cycle", async () => {
    try {
      await RoscaInstance.contribute({
        from: accounts[0],
        value: 200,
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("Won't accept bids while the cycle is not complete", async () => {
    await RoscaInstance.enter({
      from: accounts[0],
      value: 200,
    });

    try {
      await RoscaInstance.bid(20, {
        from: accounts[0],
        gas: "1000000",
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("Complete an entire cycle, including payout to highst bidder and starting new cycle", async () => {
    await RoscaInstance.enter({
      from: accounts[0],
      value: 200,
    });

    await RoscaInstance.enter({
      from: accounts[1],
      value: 200,
    });

    await RoscaInstance.enter({
      from: accounts[2],
      value: 200,
    });

    await RoscaInstance.enter({
      from: accounts[3],
      value: 200,
    });

    await RoscaInstance.enter({
      from: accounts[4],
      value: 200,
    });

    await RoscaInstance.bid(20, {
      from: accounts[1],
      gas: "1000000",
    });

    await RoscaInstance.bid(50, {
      from: accounts[2],
      gas: "1000000",
    });

    // accounts[2] has made the highest bid and should win the cycle's pool
    await RoscaInstance.endCycle({
      from: accounts[0],
      gas: "1000000",
    });

    let participant = await RoscaInstance.participants(accounts[2]);

    assert(participant.amount == 250);
    assert(participant.wonCycle);

    let oldCycle = await RoscaInstance.getCycle(0);

    assert(oldCycle[2]);
    assert(oldCycle[0] == 1000);
    assert(oldCycle[1] == 1000);

    let newCycle = await RoscaInstance.getCycle(1);

    assert(newCycle[1] == 1050);
  });

  it("Summary includes an array of participant addresses", async () => {
    await RoscaInstance.enter({
      from: accounts[0],
      value: 200,
    });

    await RoscaInstance.enter({
      from: accounts[1],
      value: 200,
    });

    await RoscaInstance.enter({
      from: accounts[2],
      value: 200,
    });

    let summary = await RoscaInstance.getSummary();

    assert(Array.isArray(summary.participants));
    assert(summary.participants[0] == accounts[0]);
    assert(summary.participants[1] == accounts[1]);
    assert(summary.participants[2] == accounts[2]);
  });

  it("Refunds money properly", async () => {
    RoscaInstanceSpecial = await Rosca.new(
      web3.utils.toWei("10", "ether"),
      5,
      accounts[0],
      "Testing circle :)"
    );

    await RoscaInstanceSpecial.enter({
      from: accounts[1],
      value: web3.utils.toWei("4", "ether"),
    });

    await RoscaInstanceSpecial.enter({
      from: accounts[2],
      value: web3.utils.toWei("3", "ether"),
    });

    let balanceOld1 = await web3.eth.getBalance(accounts[1]);
    balanceOld1 = web3.utils.fromWei(balanceOld1, "ether");
    balanceOld1 = parseFloat(balanceOld1);

    let balanceOld2 = await web3.eth.getBalance(accounts[2]);
    balanceOld2 = web3.utils.fromWei(balanceOld2, "ether");
    balanceOld2 = parseFloat(balanceOld2);

    await RoscaInstanceSpecial.resetCycle();

    let cycleSummary = await RoscaInstanceSpecial.getCycle(0);

    assert(cycleSummary[0] == 0);
    assert(!cycleSummary[2]);

    let participants = await RoscaInstanceSpecial.getParticipants();

    assert(participants.length == 0);

    let part1 = await RoscaInstanceSpecial.participants(accounts[1]);
    assert(!part1.set);

    let balanceNew1 = await web3.eth.getBalance(accounts[1]);
    balanceNew1 = web3.utils.fromWei(balanceNew1, "ether");
    balanceNew1 = parseFloat(balanceNew1);

    let balanceNew2 = await web3.eth.getBalance(accounts[2]);
    balanceNew2 = web3.utils.fromWei(balanceNew2, "ether");
    balanceNew2 = parseFloat(balanceNew2);

    assert(balanceNew1 > balanceOld1 + 3);
    assert(balanceNew2 > balanceOld2 + 2);
  });
});
