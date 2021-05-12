const RoscaFactory = artifacts.require("RoscaFactory");
const Rosca = artifacts.require("Rosca");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(RoscaFactory);
  deployer.deploy(Rosca, 1000, 4, accounts[0], "test :)");
};
