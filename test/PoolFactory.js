const { expect } = require("chai");
const { ethers } = require("hardhat")

describe("PoolFactory contract", function () {
  let poolFactoryContract;
  let poolFactoryToken;
  let owner;

  beforeEach(async function () {
    poolFactoryContract = await ethers.getContractFactory("PoolFactory");
    [owner, addy1, addy2] = await ethers.getSigners();

    poolFactoryToken = await poolFactoryContract.deploy();
    await poolFactoryToken.deployed();
  });

  
  describe("Pool dynamics", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.
    it("Should create a pool", async function () {
      //create a pool
      poolRef = await poolFactoryToken.createPool("tadPool", [addy1.address]);
      pools = await poolFactoryToken.listPools();
      expect( pools.length).to.equal(1);
    });

    it("Pool should have admin var defined", async function () {
      // Acquire pool contract
      poolRef = await poolFactoryToken.createPool("tadPool2", [addy2.address]);
      poolConFac = await ethers.getContractFactory("Pool");
      poolCon = await poolConFac.attach(addy2.address);

      // just for demo
      // remove if DS is changed
      expect(await poolCon.admins.length).to.equal(0);
      
    });
 
  });
});

