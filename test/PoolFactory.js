const { expect } = require("chai");
const { ethers } = require("hardhat")

describe("PoolFactory contract", function () {
  let poolFactoryContract;
  let poolFactoryToken;
  let owner;

  beforeEach(async function () {
    poolFactoryContract = await ethers.getContractFactory("PoolFactory");
    [address1, address2, admin1, admin2] = await ethers.getSigners();

    poolFactoryToken = await poolFactoryContract.deploy();
    await poolFactoryToken.deployed();
  });

  
  describe("Pool dynamics", function () {
    it("Should create a pool", async function () {
      //create a pool and test the listPools() & getNumPools() functions
      await poolFactoryToken.createPool("TestPool1", [address1.address]);
      const pools = await poolFactoryToken.listPools();
      expect(pools.length).to.equal(1);
      expect(await poolFactoryToken.getNumPools()).to.equal(1);
    });

    it("Factory should create a pool with the correct name and admins", async function () {
      // Create a Pool
      const poolName = "TestPool2";
      const admins = [admin1.address, admin2.address];
      await poolFactoryToken.createPool(poolName, admins);

      // Acquire the Pool contract and create an instance of that contract
      const poolContract = await ethers.getContractFactory("Pool");
      const poolAddress = (await poolFactoryToken.listPools())[0];
      const poolContractInstance = await poolContract.attach(poolAddress);

      // Assert the expected values
      expect(await poolContractInstance.name()).to.equal(poolName);
      expect(await poolContractInstance.admins(0)).to.equal(admins[0]);
      expect(await poolContractInstance.admins(1)).to.equal(admins[1]);
    });
  });
});
