// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
}

contract ScopedVault {
    address public owner;
    bool public paused;

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function pause() external onlyOwner {
        paused = true;
    }

    function rescue(address token, address to, uint256 amount) external onlyOwner {
        require(paused, "not paused");
        IERC20(token).transfer(to, amount);
    }

    function callHook(address hook, bytes calldata data) external onlyOwner {
        (bool ok,) = hook.call(data);
        require(ok, "hook failed");
    }
}

