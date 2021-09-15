require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks : {
    rinkeby : {
      url : "https://speedy-nodes-nyc.moralis.io/35781d7bc9e401e1fa975f78/eth/rinkeby",
      accounts : ["144e9fad3c58582f920889d822436525facc11c74e16e8124a62ce42d532800e"]
    }
  }
};