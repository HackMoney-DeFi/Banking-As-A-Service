
// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");
const { ethers } = require("hardhat")

describe("LibToken contract", function () {

  let owner; 
  beforeEach(async function () {

    LibToken = await ethers.getContractFactory("LibToken");
    [owner] = await ethers.getSigners();

    LibToken = await LibToken.deploy(owner.address);
    await LibToken.deployed();
    
    await LibToken.deployed();
  });

  describe("Deployment", function () {
      
    it("Has the right initialization", async function () {
      expect(await LibToken.symbol()).to.equal("LIB");
      expect(await LibToken.name()).to.equal("LibertyToken")
    });

    it("Owner can mint", async function () {
        expect(await LibToken.totalSupply()).to.equal(0)
        await LibToken.mint(owner.address, 99999)
        expect(await LibToken.totalSupply()).to.equal(99999)
        expect(await LibToken.balanceOf(owner.address)).to.equal(99999)
    });

  });
});