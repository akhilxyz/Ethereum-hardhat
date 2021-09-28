// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command line interface.
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled

  // We get the contract to deploy
  const Campaign = await ethers.getContractFactory("CampaignTestCase") ;
  const campaign = await Campaign.deploy();

  await campaign.deployed();

  console.log("Campaign deployed to:", campaign.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });