const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const web3 = require('web3')

describe("Test case for Campaign Contact", () => {
    // getting accounts information of contract
    beforeEach(async () => {
        accounts = await ethers.getSigners();
        manager = await accounts[0];
        account_1 = await accounts[1];
        account_2 = await accounts[2];
        account_3 = await accounts[3];
        // A CampaignTestCase in ethers.js is an abstraction used to deploy new smart contracts,
        // so CampaignTestCase here is a factory for instances of our Lottery contract.
        getContract = await ethers.getContractFactory("CampaignTestCase");
        contract = await getContract.deploy();
    });

    // testcase for contribute in Campaign function
    describe("Entering the Campain", () => {
        it("deploy a contract", async () => {
            assert.ok(contract)
        })
        it("Contribute minimum value", async () => {
            await contract.connect(account_1).contribute({value : 1});
        })
        it("Contribute below than minimum value", async () => {
            msg = 'please enter minumum contribution amount';
            await expect(contract.connect(account_1).contribute({value : 0})).to.be.revertedWith(msg);
        })
    });

    // creating a request for campaign's reward
    describe("Creating a request for campaign", () => {
        it("Contribute minimum value", async () => {
            await contract.connect(account_1).contribute({value : 1000});
            await contract.connect(account_1).createRequest("buying something",1,account_1.address);
        })
    });

    // Approving user request for campaign's reward
    describe("Approving user request", () => {
        it("approveRequest", async () => {
            await contract.connect(account_1).contribute({value : 1000});
            await contract.connect(manager).createRequest("buying something",1,account_1.address);
            await contract.connect(account_1).approveRequest(0);
        })
        it("if approver not a manager", async () => {
            await contract.connect(account_1).contribute({value : 1000});
            await contract.connect(account_1).createRequest("buying something",1,account_1.address);
            msg = "you are not manager"
            await expect(contract.connect(account_2).approveRequest(0)).to.be.revertedWith(msg);
        })
    });

    // finalize user request for campaign's 
     
    describe("finalizeRequest user request", () => {
        it("finalizeRequest", async () => {
            await contract.connect(account_1).contribute({value : 1000});
            await contract.connect(manager).createRequest("buying something",1,account_1.address);
            await contract.connect(account_1).approveRequest(0);
            await contract.connect(account_1).finalizeRequest(0);
        })
    });

    // check total contribution Amount ofcampaign
     
    describe("total contribution Amount", () => {
        it("contributionAmount", async () => {
            await contract.connect(account_1).contribute({value : 1000});
            let contributionAmount = await contract.connect(account_1).contributionAmount()
            expect(contributionAmount).to.be.equal(1000);
        })
    });

} )