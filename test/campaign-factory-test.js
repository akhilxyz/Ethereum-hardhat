const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const web3 = require('web3')

describe("Test case for CampaignFactory Contact", () => {
    // getting accounts information of contract
    beforeEach(async () => {
        accounts = await ethers.getSigners();
        manager = await accounts[0];
        account_1 = await accounts[1];
        account_2 = await accounts[2];
        account_3 = await accounts[3];
        // A CampaignTestCase in ethers.js is an abstraction used to deploy new smart contracts,
        // so CampaignTestCase here is a factory for instances of our Lottery contract.
        getContract = await ethers.getContractFactory("CampaignFactory");
        contract = await getContract.deploy();
    });

    // testcase for contribute in Campaign function
    describe("Entering the Campain", () => {
        it("deploy a contract", async () => {
            assert.ok(contract)
        })
        it("creating new Campaign", async () => {
            await contract.connect(account_1).createCampaign(0);
        })
        it("deployed new Campaign", async () => {
            await contract.connect(account_1).createCampaign(0);
            await contract.connect(account_1).deployedCampaigns();
        })
    });
} )