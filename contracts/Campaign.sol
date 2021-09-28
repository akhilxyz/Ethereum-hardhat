// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

// CampaignFactory create new instance of Campaign contract

contract CampaignFactory{
    address[] public deployCampaign;
    function createCampaign(uint minimum) public {
        address newCampaign = address (new Campaign(minimum, msg.sender));
        deployCampaign.push(newCampaign);
    }
    // it will returns the array of deployed Campaigns
    function deployedCampaigns() public view returns(address[] memory) {
        return deployCampaign;
    }
}

contract Campaign {
    //  Struct types are used to represent a record.
    // The struct keyword defines a new data type, with more than one member.
    // The format of the struct statement is as follows -

    struct Request {
        string  description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    // Mapping is a reference type as arrays and structs. Following is the syntax to declare a mapping type.

    mapping (uint => Request) requests;
    address public manager ;
    uint public minmumContribution ;
    uint numRequests;
    uint approversCount ;
    mapping(address => bool) public approvers;

    // modifier

    modifier restricted(){
        manager = msg.sender;
        _;
    }
    // Constructor is a special function declared using constructor keyword.
    // It is an optional funtion and is used to initialize state variables of a contract.
    // Following are the key characteristics of a constructor.

    constructor(uint minimum, address creator) {
        manager = creator;
        minmumContribution = minimum;
    }

    // --- contribute function allow you to contribute in Campaign ---

    function contribute() public payable {
        require(msg.value > minmumContribution, "please enter minumum contribution amount");
        approvers[msg.sender] = true;
        approversCount++;
    }

    // --- contributionAmount function will returns the total contribution amount in Campaign

    function contributionAmount() public view returns(uint){
        return address(this).balance ;
    }

    // --- createRequest function will create the Request by manager for contribution ---

   function createRequest(string memory description, uint value, address recipient) public restricted{
        Request storage r = requests[numRequests++];
        r.description = description;
        r.value = value;
        r.recipient = recipient;
        r.complete = false;
        r.approvalCount = 0;
    }

    // --- approveRequest function to send the amount to Requester ---

    function approveRequest(uint index) public {
        Request storage request = requests[index];
        require(approvers[msg.sender],"you are not manager");
        require(!request.approvals[msg.sender],"you are already contributed");
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    // --- finalizeRequest function will finalize the request for approval

    function finalizeRequest(uint index) public payable restricted {
    Request storage request = requests[index];
    require(request.approvalCount > (approversCount / 2), "something went wrong");
    require(!request.complete, "request is not completed");
    payable(request.recipient).transfer(request.value);
    request.complete = true;
   }
    // ---------------------- get summery function------------------------------
     function getSummery() public view returns(uint, uint, uint, uint, address) {
       return (minmumContribution, address(this).balance, numRequests, approversCount, manager);
    }

    // -------------------- view request details ----------------------------------

     function viewRequest(uint requestNumber) public view returns(string memory description, uint value, address recipient,  bool complete   ){
        Request storage r = requests[requestNumber];
        return (r.description, r.value, r.recipient, r.complete);
    }

    // -------------------------- get request count -----------------------------------
   function getRequestsCount() public view returns(uint){
       return numRequests;
   }
}
