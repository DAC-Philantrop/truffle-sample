// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Storage {

    // see solidity documentation
    bytes public data;

    // see solidity documentation
    uint256[] public uintarray;

    struct Struct256 {
        uint256 x;
        uint256 y;
    }

    struct Struct128 {
        uint128 x;
        uint128 y;
    }

    uint256 storageSlot2 = type(uint256).max;
    uint256 storageSlot3 = type(uint128).max;

    // structs ALWAYS start a new storage slot
    // bigStruct uses 2 full storage slots
    Struct256 public bigStruct;
    // smallStruct uses 1 full storage slot
    Struct128 public smallStruct;

    // next three are all saved in one storage slot
    address public deployer = msg.sender;
    bool public boolean = true;
    uint8 public smallInt = type(uint8).max;

    constructor(Struct256 memory _bigStruct, Struct128 memory _smallStruct) {
        bigStruct = _bigStruct;
        smallStruct = _smallStruct;
    }

    function setStruct256Both(uint256 x, uint256 y) external {
        bigStruct = Struct256(x, y);
    }

    function setStruct256Single(uint256 x) external {
        bigStruct.x = x;
    }

    function setStruct128Both(uint128 x, uint128 y) external {
        smallStruct = Struct128(x, y);
    }

    function setStruct128Single(uint128 x) external {
        smallStruct.x = x;
    }
    
    function setData(bytes calldata longData) external {
        data = longData;
    }

    function readBigStorageStructBoth() external view returns(uint256, uint256) {
        return (bigStruct.x, bigStruct.y);
    }

    function readBigStorageStructSingle() external view returns(uint256) {
        return bigStruct.x;
    }

    function readSmallStorageStructBoth() external view returns(uint256, uint256) {
        return (smallStruct.x, smallStruct.y);
    }

    function readSmallStorageStructSingle() external view returns(uint256) {
        return (smallStruct.x);
    }
}
