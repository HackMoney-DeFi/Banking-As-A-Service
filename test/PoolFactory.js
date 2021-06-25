const { expect } = require("chai");
const { ethers } = require("hardhat")

describe("PoolFactory contract", function () {
  let poolFactoryContract;
  let poolFactoryToken;
  let owner;

  beforeEach(async function () {
    poolFactoryContract = await ethers.getContractFactory("PoolFactory");
    [owner] = await ethers.getSigners();

    poolFactoryToken = await poolFactoryContract.deploy();
    await poolFactoryToken.deployed();

    await poolFactoryToken.deployed();
  });

  // TODO: Add tests
});
