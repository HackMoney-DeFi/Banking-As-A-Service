//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./BancorFormula.sol";

// We import this library to be able to use console.log
import "hardhat/console.sol";

contract LibertyToken is ERC20Pausable, BancorFormula {
    using SafeMath for uint256;
    event Minted(address sender, uint amount, uint deposit);
    event Burned(address sender, uint amount, uint refund);

    uint256 public scale = 10**18;
    uint256 public reserveBalance = 10*scale;
    uint256 public reserveRatio;
        
    constructor(
        string memory _name, 
        string memory _symbol,
        uint256 initialSupply,
        uint256 _reserveRatio
    ) ERC20(_name, _symbol)
    { 
         reserveRatio = _reserveRatio;
        _mint(_msgSender(), initialSupply.mul(scale));
    }

    function mint() public payable {
        require(msg.value > 0, "Must send ether to buy tokens.");
        _continuousMint(msg.value);
    }

    function burn(uint256 _amount) public {
        uint256 returnAmount = _continuousBurn(_amount);
        payable(msg.sender).transfer(returnAmount);
    }

    function calculateMintReturn(uint256 _amount)
        public view returns (uint256 mintAmount)
    {
        return calculatePurchaseReturn(totalSupply(), reserveBalance, uint32(reserveRatio), _amount);
    }

    function calculateBurnReturn(uint256 _amount)
        public view returns (uint256 burnAmount)
    {
        return calculateSaleReturn(totalSupply(), reserveBalance, uint32(reserveRatio), _amount);
    }
    
    function _continuousMint(uint256 _deposit)
        internal returns (uint256)
    {
        require(_deposit > 0, "Deposit must be non-zero.");
        
        uint256 amount = calculateMintReturn(_deposit);
        
        _mint(msg.sender, amount);
        reserveBalance = reserveBalance.add(_deposit);
        emit Minted(msg.sender, amount, _deposit);
        return amount;
    }

    function _continuousBurn(uint256 _amount)
        internal returns (uint256)
    {
        require(_amount > 0, "Amount must be non-zero.");
        require(balanceOf(msg.sender) >= _amount, "Insufficient tokens to burn.");

        uint256 reimburseAmount = calculateBurnReturn(_amount);
        reserveBalance = reserveBalance.sub(reimburseAmount);
        _burn(msg.sender, _amount);
        emit Burned(msg.sender, _amount, reimburseAmount);
        return reimburseAmount;
    }

}
