pragma solidity ^0.4.17;

import "./ownable.sol";


contract ShipCodeContract is Ownable {
    uint public price;
	string public currentVersion;
	string private downloadHash;
    mapping (address => bool) paidCustomers;

	// constructor
	function ShipCodeContract() {
		price = 0.1 ether;
	}

    function deployProductVersion(string _version, string _ipfsHash) public onlyOwner returns (bool) {
		currentVersion = _version;
		downloadHash = _ipfsHash;
    }

    function buyProduct() public payable {
		require(msg.value >= price);
		paidCustomers[msg.sender] = true;
    }

	function retriveProduct() constant returns (string) {
        if (paidCustomers[msg.sender]) {
		    return downloadHash;
        }
        return '';
	}
}
