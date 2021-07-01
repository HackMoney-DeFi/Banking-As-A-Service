const { expect } = require("chai");
const { ethers } = require("hardhat")

describe("Pool contract", function () {
  let poolFactoryContract;
  let poolFactoryToken;

  beforeEach(async function () {
    poolFactoryContract = await ethers.getContractFactory("PoolFactory");
    [admin, nonAdmin] = await ethers.getSigners();

    libFactory = await ethers.getContractFactory("LibToken");
    LibToken = await libFactory.deploy("LibToken", "Lib");
    await LibToken.deployed();


    skLibFactorty = await ethers.getContractFactory("StkLibToken")
    skLibToken = await skLibFactorty.deploy(LibToken.address, "stkLib Token",  "stkLib")
    await skLibToken.deployed();



    poolFactoryToken = await poolFactoryContract.deploy(skLibToken.address);
    await poolFactoryToken.deployed();
  });
  

  async function StkToken(amount) {

    await LibToken.mint(admin.address, amount) 
    await LibToken.approve(skLibToken.address, amount)
    expect(await LibToken.allowance(admin.address, skLibToken.address)).to.equal(amount)

    // Stake LibToken
    await skLibToken.stake(amount)
    expect(await skLibToken.balanceOf(admin.address)).to.equal(amount)
    expect(await LibToken.balanceOf(admin.address)).to.equal(0)
  }

  
  describe("Pool functionality", function () {
    it("Admin should be able to add/remove users to/from the admin list", async function () {
      await StkToken(ethers.BigNumber.from("1000000000000000000000000000"))
      //create a pool and an instance of the contract
      await poolFactoryToken.createPool("TestPool1", [admin.address]);
      const poolAddress = (await poolFactoryToken.listPools())[0];
      const poolContract = await ethers.getContractFactory("Pool");
      const poolContractInstance = await poolContract.attach(poolAddress);

      // Sanity check then proceed to adding the user as an admin
      expect(await poolContractInstance.admins(nonAdmin.address)).to.equal(false);
      const msgSender = await poolContractInstance.addAdmin(nonAdmin.address);
      expect(await poolContractInstance.admins(nonAdmin.address)).to.equal(true);

      // Remove the user from the admins list
      await poolContractInstance.removeAdmin(nonAdmin.address);
      expect(await poolContractInstance.admins(nonAdmin.address)).to.equal(false);

      // TODO: A non-admin trying to manipulate the admin list should throw an error
    });
  });
});
