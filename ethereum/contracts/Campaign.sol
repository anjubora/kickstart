pragma solidity >=0.4.22 <0.6.0;

contract CompaignFactory{
    Campaign[] public deployedContract;
    function createContract(uint min) public  {
        Campaign newCompaign = new Campaign(min,msg.sender);
        deployedContract.push(newCompaign);
         }
    function getDeployedCampaigns() public view  returns( Campaign[] memory){
        return deployedContract;
    }
}

contract Campaign{
    struct Request{
        string description;
        uint value;
        address payable recepient;
        bool complete;
        mapping(address=>bool) approvals;
        uint approvalCount;
    }
    Request[] public requests;
    address public manager;
    uint public  minimumContribution;
    mapping(address=>bool) public  approvers;
    uint public approversCount;
    constructor(uint minimum,address creator)  public{
        manager = creator;
        minimumContribution = minimum;
    }
    function contribute() public payable{
        require(msg.value>minimumContribution);
        approvers[msg.sender] = true;
        approversCount++;
    }
    modifier restricted()
    {  require(msg.sender == manager);
        _;
    }
    function createRequest(string memory description,uint value,address payable recepient) public restricted{
       Request memory  newRequest = Request({
           description:description,
           value:value,
           recepient:recepient,
           complete:false,
           approvalCount:0
           }) ;
          requests.push(newRequest);
     }
     function approveRequest(uint index) public {
        Request storage request = requests[index];
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    function finalizeRequest(uint index) public restricted{
        Request storage request = requests[index];
        require(!request.complete);
        require(request.approvalCount>(approversCount/2));
        request.recepient.transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns(uint,uint,uint,uint,address){
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager
        );
    }
    function getRequestsCount() public view returns (uint){
     return requests.length;
    }

    }