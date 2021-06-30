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

  console.log("Pool address:", poolFactory.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(poolFactory);
}

function saveFrontendFiles(token) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../real-frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ PoolFactory: token.address }, undefined, 2)
  );

  const PoolFactoryArtifact = artifacts.readArtifactSync("PoolFactory");

  fs.writeFileSync(
    contractsDir + "/PoolFactory.json",
    JSON.stringify(PoolFactoryArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
