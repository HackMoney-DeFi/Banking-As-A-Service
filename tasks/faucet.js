const fs = require("fs");

// This file is only here to make interacting with the Dapp easier,
// feel free to ignore it if you don't need it.

task("faucet", "Sends ETH and tokens to an address")
  .addPositionalParam("receiver", "The address that will receive them")
  .setAction(async ({ receiver }) => {
    if (network.name === "hardhat") {
      console.warn(
        "You are running the faucet task with Hardhat network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }

    const addressesFile =
      __dirname + "/../frontend/src/contracts/contract-address.json";

    if (!fs.existsSync(addressesFile)) {
      console.error("You need to deploy your contract first");
      return;
    }

    const addressJson = fs.readFileSync(addressesFile);
    const address = JSON.parse(addressJson);

    if ((await ethers.provider.getCode(address.PoolFactory)) === "0x") {
      console.error("You need to deploy your contract first");
      return;
    }
    

  

    const token = await ethers.getContractAt("LibToken", address.libToken);
    const [sender] = await ethers.getSigners();

    skLibFactorty = await ethers.getContractFactory("StkLibToken")
    skLibToken = await skLibFactorty.deploy(token.address, "stkLib Token",  "stkLib")
    await skLibToken.deployed();


    //send some libTokens
    await token.mint(receiver, ethers.BigNumber.from("9000000000000000000000000000") );
    await token.approve(address.libToken, receiver);
    await token.allowance(receiver, token.address)

    console.log(ethers.constants.WeiPerEther);
    const tx2 = await sender.sendTransaction({
      to: receiver,
      value: ethers.constants.WeiPerEther,
    });
    await tx2.wait();

    console.log(`Transferred 1 ETH and 100 tokens to ${receiver}`);
  });
