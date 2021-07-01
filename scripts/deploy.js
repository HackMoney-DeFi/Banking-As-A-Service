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
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const PoolFactory = await ethers.getContractFactory("PoolFactory");
  const poolFactory = await PoolFactory.deploy();
  await poolFactory.deployed();
  

  [address1, admin1, admin2, admin3, admin4, admin5] = await ethers.getSigners();
  console.log(admin1.address, admin2.address);
  await poolFactory.createPool("Ethiopian Farmers", [admin1.address, admin2.address]);
  await poolFactory.createPool("BitCoin Birr Donation", [admin3.address, admin4.address]);
  await poolFactory.createPool("Accra Credit Union", [admin4.address, admin5.address]);

  const poolAddress = (await poolFactory.listPools());
  console.log("Pools :", poolAddress)


  //add sample pools

  console.log("PoolFactory address:", poolFactory.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(poolFactory);
}

function saveFrontendFiles(poolFactory) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ PoolFactory: poolFactory.address }, undefined, 2)
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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
