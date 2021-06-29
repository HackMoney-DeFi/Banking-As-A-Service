
// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require("chai");
const { ethers } = require("hardhat")

describe("FedToken contract", function () {
  // Mocha has four functions that let you hook into the the test runner's
  // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  let Token;
  let hardhatToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    fedToken = await ethers.getContractFactory("FedToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    FEDToken = await fedToken.deploy("FedToken", "FED");
    await FEDToken.deployed();

    // We can interact with the contract by calling `hardhatToken.method()`
    await FEDToken.deployed();
  });

  // You can nest describe calls to create subsections.
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


    // it("Should assign the total supply of tokens to the owner", async function () {
    //   const ownerBalance = await hardhatToken.balanceOf(owner.address);
    //   expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    // });
  });
});