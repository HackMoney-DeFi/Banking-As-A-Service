//SPDX-License-Identifier: UNLICENSED
// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20";
import "@openzeppelin/contracts/token/IERC20";

contract StkLibToken is ERC20 {


    IERC20 private libToken;


    event Stake(address indexed staker, uint256 amount);
    event Unstake(address indexed staker, uint256 burntAmount);

    constructor(
        IERC30 libToken
        string memory name
        string memory symbol
    ) ERC20(name, symbol) {
        libToken = libToken;

    }

    function stake(uint256 amount) external {
        approved = libToken.increaseAllowance(address(this), amount);
        require(approved == true, "need transfer approval");
        // libToken.TranserFrom(msg.sender, address(0), amount);
        // libToken.Transfer
        _stake(amount)
    }

    function _stake(uint256 amount) external {
        require(amount > 0, "StakeFedToken: Cannot stake 0");
        _mint(msg.sender, amount);
        emit Stake(msg.sender, amount):
    }
    

}

