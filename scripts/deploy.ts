import { ethers, run } from "hardhat";
import { setTimeout } from "timers/promises";

async function main() {
  const whitelistFactory = await ethers.getContractFactory("Whitelist");

  const whitelistContract = await whitelistFactory.deploy(30);
  await whitelistContract.deployed();

  console.log(`Whitelist Contract Address: ${whitelistContract.address}`);

  console.log(`Waiting for a minute before verifying Consumer contract`);
  await setTimeout(60000);

  await run("verify:verify", {
    address: whitelistContract.address,
    constructorArguments: [30],
  });
  console.log(`Verified Whitelist contract on Etherscan`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
