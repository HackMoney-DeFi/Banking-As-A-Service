//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./VoteToken.sol";

import "hardhat/console.sol";

contract StkLibToken is VoteToken, ReentrancyGuard {

    // Address of LibToken contract
    address public LibToken;

    event Stake(address indexed staker, uint256 amount);
    event Unstake(address indexed staker, uint256 burntAmount);

    constructor(
        address libToken,
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) {
        LibToken = libToken;
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _amount
    ) internal override {
        require(_to != address(this), "stkLibToken: Can't transfer to the Lib contract itself");
        super._transfer(_from, _to, _amount);
    }

    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "StakeLibToken: Cannot stake 0 amount");
        IERC20(LibToken).transferFrom(msg.sender, address(this), amount);
        _stake(amount);
    }

    function unstake(uint256 amount) external nonReentrant {
        uint256 balance = balanceOf(msg.sender);
        require(balance >= amount, "Amount exceeds balance.");
        _unstake(amount);
    }

    function _stake(uint256 amount) internal  {
        _mint(msg.sender, amount);
        emit Stake(msg.sender, amount);
    }

    function _unstake(uint256 amount) internal {
        // Burn the stk tokens
        _burn(msg.sender, amount);
        
       // Give user back their staked token
        IERC20(LibToken).transfer(msg.sender, amount);
        emit Unstake(msg.sender, amount);
    }
}

