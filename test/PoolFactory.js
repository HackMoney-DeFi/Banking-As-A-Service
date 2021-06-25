const { expect } = require("chai");
const { ethers } = require("hardhat")

describe("PoolFactory contract", function () {
  let PoolFactory;
  let hardhatToken;
  let owner;

  beforeEach(async function () {
    PoolFactory = await ethers.getContractFactory("PoolFactory");
    [owner] = await ethers.getSigners();

    hardhatToken = await PoolFactory.deploy();
    await hardhatToken.deployed();

    await hardhatToken.deployed();
  });

  // TODO: Add tests
});
