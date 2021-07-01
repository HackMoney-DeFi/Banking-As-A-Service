
// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");
const { ethers } = require("hardhat")

describe("stkToken contract", function () {

  let alice;
  let bob;
  beforeEach(async function () {

    [alice, bob] = await ethers.getSigners();

    libFactory = await ethers.getContractFactory("LibToken");
    LibToken = await libFactory.deploy("LibToken", "Lib");
    await LibToken.deployed();


    skLibFactorty = await ethers.getContractFactory("StkLibToken")
    skLibToken = await skLibFactorty.deploy(LibToken.address, "stkLib Token",  "stkLib")
    await skLibToken.deployed();
    
  });

  describe("Deployment", function () {
      
    it("Has the right initialization", async function () {
      expect(await LibToken.symbol()).to.equal("Lib");
      expect(await LibToken.name()).to.equal("LibToken")

      expect(await skLibToken.name()).to.equal("stkLib Token")
    });

    it("stakes and unstakes properly", async function () {
        amount = 1000000
        await LibToken.mint(alice.address, amount) 
        await LibToken.approve(skLibToken.address, amount)
        expect(await LibToken.allowance(alice.address, skLibToken.address)).to.equal(amount)

        // Stake LibToken
        await skLibToken.stake(amount)
        expect(await skLibToken.balanceOf(alice.address)).to.equal(amount)
        expect(await LibToken.balanceOf(alice.address)).to.equal(0)

        // Unstake LibToken
        await skLibToken.unstake(amount)
        expect(await skLibToken.balanceOf(alice.address)).to.equal(0)
        expect(await LibToken.balanceOf(alice.address)).to.equal(amount)
    });

  });
});