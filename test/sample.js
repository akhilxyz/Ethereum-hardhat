const { expect } = require("chai");
const { ethers } = require("hardhat");
// const Lottery = artifacts.require("Lottery");

describe("Test case for Lottery Contact", () => {

    // getting accounts information of contract
    beforeEach(async () => {
        accounts = await ethers.getSigners();
        manager = await accounts[0];
        account_1 = await accounts[1];
        account_2 = await accounts[2];
        account_3 = await accounts[3];
        //A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
        // so Lottery here is a factory for instances of our Lottery contract.
        getContract = await ethers.getContractFactory("Lottery");
        contract = await getContract.deploy();
    });

    // testcase for entering in lottery contest function
    // entering in the lottery with valid and invallid value of amount
    describe("Entering the Lottery contest", () => {
        it("entering with valid value", async () => {
            await contract.connect(manager).enter({value : 11});
            array = await contract.connect(manager).playerRecord();
            expect(array[0]).to.be.equal(manager.address);
        })
        // entering the wrong value in contest
        it("entering with invalid value", async () => {
            msg = 'Lottery: enter amount value should be 11';
            await expect(contract.connect(manager).enter({value : 1})).to.be.revertedWith(msg);
        });
    });

    // testcase for picking winner 
    // checking if winner picking by manager or not 
    describe("Picking Winner Function", () => {
        it("manager is picking the winner", async () => {
            await contract.connect(account_1).enter({value : 11});
            await contract.connect(manager).pickWinner();
        });
        it("Someone else is picking the winner", async () => {
            await contract.connect(manager).enter({value : 11});
            msg = 'Lottery: Msg.sender is not manager'
            await expect(contract.connect(account_1).pickWinner()).to.be.revertedWith(msg);
        });
    });

    // checking if Price is sent to Winner or not 
    describe("Price is sent to Winner", () => {
        it("check price is sent", async () => {
            await contract.connect(account_1).enter({value : 11});
            await contract.connect(account_2).enter({value : 11});
            await contract.connect(account_3).enter({value : 11});
            await contract.connect(manager).pickWinner();
            let checkBalance =  await contract.connect(manager).checkBalance();
            expect(checkBalance).to.be.equal(0);
        });
    });

} )