var ShipCodeContract = artifacts.require("./ShipCodeContract.sol");

module.exports = function(deployer) {
  deployer.deploy(ShipCodeContract);
};
