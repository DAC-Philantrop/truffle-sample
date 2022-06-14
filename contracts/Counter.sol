// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";


// everyone can increment and decrement, but only the owner can set an arbitrary value
contract Counter is Ownable {

    event OwnerSetValue(address indexed owner, uint256 value);

    constructor(uint256 startingValue) {
        count = startingValue;
    }

    uint256 internal count;

    function get() public view returns (uint) {
        return count;
    }

    function inc() public {
    // This function will fail if count = 2 ** 256 - 1
        count += 1;
    }

    function dec() public {
        // This function will fail if count = 0
        count -= 1;
    }

    function setCount(uint256 newCount) external onlyOwner {
        count = newCount;
        emit OwnerSetValue(msg.sender, newCount);
    }
}
