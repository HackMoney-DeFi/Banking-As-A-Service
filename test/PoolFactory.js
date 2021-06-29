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
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.
    it("Should create a pool", async function () {
      //create a pool
      poolRef = await poolFactoryToken.createPool("TestPool1", [address1.address]);
      pools = await poolFactoryToken.listPools();
      expect( pools.length).to.equal(1);
    });

    it("Factory should create a pool with the correct name, admins", async function () {
      // Acquire pool contract
      poolName = "TestPool2";
      admins = [admin1.address, admin2.address];
      poolRef = await poolFactoryToken.createPool(poolName, admins);

      poolConFac = await ethers.getContractFactory("Pool");
      poolAddress = (await poolFactoryToken.listPools())[0];
      poolCon = await poolConFac.attach(poolAddress);

      gotName = await poolCon.name();
      gotAdmins = await poolCon.admins;

      expect(await poolCon.admins(0)).to.equal(admins[0]);
      expect(await poolCon.admins(1)).to.equal(admins[1]);
      
    });
 
  });
});
