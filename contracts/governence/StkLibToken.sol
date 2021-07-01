pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract StkLibToken is ERC20, ReentrancyGuard{

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

    function stake(uint256 amount) external nonReentrant {
        IERC20(LibToken).transferFrom(msg.sender, address(this), amount);
        _stake(amount);
    }

    function unstake(uint256 amount) external nonReentrant {
        uint256 balance = balanceOf(msg.sender);
        require(balance >= amount, "Insufficent balanece to unstake");
        _unstake(amount);
    }

    function _stake(uint256 amount) internal  {
        require(amount > 0, "StakeLibToken: Cannot stake 0");
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

