
// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");
const { ethers } = require("hardhat")

describe("LibToken contract", function () {

  let owner; 
  beforeEach(async function () {

    LibToken = await ethers.getContractFactory("LibToken");
    [owner] = await ethers.getSigners();

    LibToken = await fedToken.deploy("LibToken", "LIB");
    await LibToken.deployed();
    
    await LibToken.deployed();
  });

  describe("Deployment", function () {
      
    it("Has the right initialization", async function () {
      expect(await LibToken.symbol()).to.equal("FED");
      expect(await LibToken.name()).to.equal("FedToken")
    });

    it("Owner can mint", async function () {
        expect(await LibToken.totalSupply()).to.equal(0)
        await LibToken.mint(owner.address, 100000)
        expect(await LibToken.totalSupply()).to.equal(100000)
        expect(await LibToken.balanceOf(owner.address)).to.equal(100000)
    });

  });
});