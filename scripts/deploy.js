// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
async function main() {
  // This is just a convenience check
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network localhost'"
    );
  }

  // ethers is avaialble in the global scope
  const [deployer, governance] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());
  auditLibraryFactory = await ethers.getContractFactory("AuditorReports")
  auditLibrary = await auditLibraryFactory.deploy()
  await auditLibrary.deployed();


  libFactory = await ethers.getContractFactory("LibToken");
  LibToken = await libFactory.deploy(deployer.address);
  await LibToken.deployed();


  skLibFactorty = await ethers.getContractFactory("StkLibToken")
  skLibToken = await skLibFactorty.deploy(LibToken.address, "stkLib Token",  "stkLib")
  await skLibToken.deployed();

  poolFactoryContract = await ethers.getContractFactory("PoolFactory");
  poolFactoryInstance = await poolFactoryContract.deploy(skLibToken.address, governance.address);

  await poolFactoryInstance.deployed();

  

  //prepopulate pools
  [admin, admin2, admin3, nonAdmin, nonAdmin1] = await ethers.getSigners();


  amount = await ethers.BigNumber.from("1000000000000000000000000000");
  await LibToken.mint(admin.address, amount) 
  await LibToken.approve(skLibToken.address, amount)
  await skLibToken.stake(amount)

  await poolFactoryInstance.createPool("Ethiopian Farmers", [admin.address, admin2.address, admin3.address]);
  await poolFactoryInstance.createPool("BitCoin Birr Donation", [admin.address, admin2.address, admin3.address]);


  pools = await poolFactoryInstance.listPools();


  saveFrontendFiles(poolFactoryInstance, LibToken, skLibToken);
}

function saveFrontendFiles(poolFactory, libToken, skLibToken) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ PoolFactory: poolFactory.address,
                     libToken: libToken.address,
                     skLibToken: skLibToken.address,

                   }, undefined, 2)
  );

  const PoolFactoryArtifact = artifacts.readArtifactSync("PoolFactory");

  fs.writeFileSync(
    contractsDir + "/PoolFactory.json",
    JSON.stringify(PoolFactoryArtifact, null, 2)
  );

  const PoolArtifact = artifacts.readArtifactSync("Pool");

  fs.writeFileSync(
    contractsDir + "/Pool.json",
    JSON.stringify(PoolArtifact, null, 2)
  );

  const LibTokenArtifact = artifacts.readArtifactSync("LibToken");
  

  fs.writeFileSync(
    contractsDir + "/LibToken.json",
    JSON.stringify(LibTokenArtifact, null, 2)
  );

  const STkLibTokenArtifact = artifacts.readArtifactSync("StkLibToken");  
  fs.writeFileSync(
    contractsDir + "/StkLibToken.json",
    JSON.stringify(STkLibTokenArtifact, null, 2)
  );


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });