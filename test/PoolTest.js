const { expect } = require("chai");
const { ethers } = require("hardhat")

describe("Pool contract", function () {
  let poolFactoryContract;
  let poolFactoryToken;

  beforeEach(async function () {
    poolFactoryContract = await ethers.getContractFactory("PoolFactory");
    [admin, admin2, admin3, nonAdmin, nonAdmin1, alice, governence] = await ethers.getSigners();

    auditLibraryFactory = await ethers.getContractFactory("AuditorReports")
    auditLibrary = await auditLibraryFactory.deploy()
    await auditLibrary.deployed();

    libFactory = await ethers.getContractFactory("LibToken");
    LibToken = await libFactory.deploy(admin.address);
    await LibToken.deployed();

    skLibFactorty = await ethers.getContractFactory("StkLibToken")
    skLibToken = await skLibFactorty.deploy(LibToken.address, "stkLib Token",  "stkLib")
    await skLibToken.deployed();

    poolFactoryToken = await poolFactoryContract.deploy(skLibToken.address, governence.address);
    await poolFactoryToken.deployed();
  });
  

  async function StkToken(amount) {

    await LibToken.mint(admin.address, amount) 
    await LibToken.approve(skLibToken.address, amount)
    // expect(await LibToken.allowance(admin.address, skLibToken.address)).to.equal(amount)

    // Stake LibToken
    await skLibToken.stake(amount)
    // expect(await skLibToken.balanceOf(admin.address)).to.equal(amount)
    // expect(await LibToken.balanceOf(admin.address)).to.equal(0)
  }

  
  describe("Pool functionality", function () {
    it("Admin should be able to add/remove users to/from the admin list", async function () {
      await StkToken(ethers.BigNumber.from("1000000000000000000000000000"))
      //create a pool and an instance of the contract
      await poolFactoryToken.createPool("TestPool1", [admin.address, admin2.address, admin3.address]);
      const poolAddress = (await poolFactoryToken.listPools())[0];
      const poolContract = await ethers.getContractFactory("Pool");
      const poolContractInstance = await poolContract.attach(poolAddress);

      // // Sanity check then proceed to adding the user as an admin
      expect(await poolContractInstance.isOwner(nonAdmin.address)).to.equal(false);


      //Add alice as admin
     callData = poolContractInstance.interface.encodeFunctionData("addOwner(address)", [alice.address])

     transactionId = await poolContractInstance.submitTransaction(poolContractInstance.address, 0, callData)
     await poolContractInstance.connect(admin2).confirmTransaction(0)


     // Assert in face alice is an admin
     expect(await poolContractInstance.isOwner(alice.address)).to.be.true

    });

    it ("Add audit report", async function() {

        await StkToken(ethers.BigNumber.from("1000000000000000000000000000"))
        //create a pool and an instance of the contract
        await poolFactoryToken.createPool("TestPool1", [admin.address, admin2.address, admin3.address]);
        const poolAddress = (await poolFactoryToken.listPools())[0];
        const poolContract = await ethers.getContractFactory("Pool");
        const poolContractInstance = await poolContract.attach(poolAddress);

        const audit = {"auditors": [], "fullAuditReport": alice.address}

        // user not a governer
        await expect( poolContractInstance.AddAuditReport(audit)).to.be.revertedWith("Only Governence allowed operation")
        
        // User is governer
        await expect( poolContractInstance.connect(governence).AddAuditReport(audit)).to.not.be.reverted

        auditReport = await poolContractInstance.getAudits()
        expect(auditReport.HistoricalAudits.length).to.equal(1)
    })
  })
});
