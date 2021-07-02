const { expect } = require("chai");
const { ethers } = require("hardhat")

describe("PoolFactory contract", function () {
  let alice;
  let bob;

  beforeEach(async function () {
    [alice, bob, governence] = await ethers.getSigners();

    libFactory = await ethers.getContractFactory("LibToken");
    LibToken = await libFactory.deploy("LibToken", "Lib");
    await LibToken.deployed();

    skLibFactorty = await ethers.getContractFactory("StkLibToken")
    skLibToken = await skLibFactorty.deploy(LibToken.address, "stkLib Token",  "stkLib")
    await skLibToken.deployed();

    poolFactoryContract = await ethers.getContractFactory("PoolFactory");
    poolFactoryInstance = await poolFactoryContract.deploy(skLibToken.address, governence.address);

    await poolFactoryInstance.deployed();
  });

  async function StkToken(amount) {

      await LibToken.mint(alice.address, amount) 
      await LibToken.approve(skLibToken.address, amount)
      expect(await LibToken.allowance(alice.address, skLibToken.address)).to.equal(amount)

      // Stake LibToken
      await skLibToken.stake(amount)
      expect(await skLibToken.balanceOf(alice.address)).to.equal(amount)
      expect(await LibToken.balanceOf(alice.address)).to.equal(0)
  }

  it("Insufficient balance to create pool", async function () {
      await StkToken(10000000000) //Insufficient balance
      await expect( poolFactoryInstance.createPool("Whoopty", [bob.address, alice.address])).to.be.revertedWith("Insufficient staked balance to create pool")
  });

  it("Sufficient balance to create pool", async function () {
      await StkToken(ethers.BigNumber.from("1000000000000000000000000000")) //sufficient balance
      await expect( poolFactoryInstance.createPool("Whoopty", [bob.address, alice.address])).to.not.be.reverted

      const pools = await poolFactoryInstance.listPools();
      expect(pools.length).to.equal(1);
      expect(await poolFactoryInstance.getNumPools()).to.equal(1);
  });

  it("Factory should create a pool with the correct name and admins", async function () {
    // Create a Pool
    await StkToken(ethers.BigNumber.from("1000000000000000000000000000")) //sufficient balance
    const poolName = "TestPool2";
    const admins  = [bob.address, alice.address]
    await expect( poolFactoryInstance.createPool(poolName, admins)).to.not.be.reverted


    // Acquire the Pool contract and create an instance of that contract
    const poolContract = await ethers.getContractFactory("Pool");
    const poolAddress = (await poolFactoryInstance.listPools())[0];
    const poolContractInstance = await poolContract.attach(poolAddress);

    // Assert the expected values
    expect(await poolContractInstance.name()).to.equal(poolName);
    expect(await poolContractInstance.isAdmin(admins[0])).to.equal(true);
    expect(await poolContractInstance.isAdmin(admins[1])).to.equal(true);
  });
});
