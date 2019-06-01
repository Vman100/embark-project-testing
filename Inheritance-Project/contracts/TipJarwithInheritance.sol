pragma solidity ^0.5.4;

// this interface defines an event and a function for later use
interface eventInterface {
    event logOwnerChange(address oldOwner, address newOwner);
    function changeOwner(address payable _newOwner) external;
}

// this contract defines an abstract function for later use
contract ownerAbstract {
    function showOwner() public view returns (address);
}

// this contract inherits from the Interface and the contract that defines an abstract function
// this defines owner related functions
contract Owner is eventInterface, ownerAbstract {
    address payable owner;
    constructor () public {
        owner = msg.sender;
    }
    function changeOwner(address payable _newOwner) public {
        require(msg.sender == owner, "caller is not owner");
        owner = _newOwner;
        emit logOwnerChange(msg.sender, _newOwner);
    }
    function showOwner() public view returns (address) {
        return owner;
    }
}

// this contract inherits from the contract that defines owner functions
// this defines tipJar functions
contract TipJar is Owner {
    function() external payable {
    }
    function withdraw() public {
        require(msg.sender == owner, "caller is not owner");
        owner.transfer(address(this).balance);
    }
}