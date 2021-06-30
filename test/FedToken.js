
// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");
const { ethers } = require("hardhat")

describe("FedToken contract", function () {

  let owner; 
  beforeEach(async function () {

    fedToken = await ethers.getContractFactory("FedToken");
    [owner] = await ethers.getSigners();

    FEDToken = await fedToken.deploy("FedToken", "FED");
    await FEDToken.deployed();
    
    await FEDToken.deployed();
  });

  describe("Deployment", function () {
      
    it("Has the right initialization", async function () {
      expect(await FEDToken.symbol()).to.equal("FED");
      expect(await FEDToken.name()).to.equal("FedToken")
    });

    it("Owner can mint", async function () {
        expect(await FEDToken.totalSupply()).to.equal(0)
        await FEDToken.mint(owner.address, 100000)
        expect(await FEDToken.totalSupply()).to.equal(100000)
        expect(await FEDToken.balanceOf(owner.address)).to.equal(100000)
    });

  });
});