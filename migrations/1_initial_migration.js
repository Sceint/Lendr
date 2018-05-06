var LoanSystem = artifacts.require("./LoanSystem.sol");

module.exports = function(deployer) {
  deployer.deploy(LoanSystem);
};
