require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");

module.exports = {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000
      }
    }
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      chainId: 1337
    },
  }
};
