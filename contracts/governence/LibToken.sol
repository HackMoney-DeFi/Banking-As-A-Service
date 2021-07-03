//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
import "./VoteToken.sol";

import "hardhat/console.sol";

contract LibToken is VoteToken {


    address private owner;

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "only owner");
        _;
    }
    
    constructor(address _owner) ERC20(name(), symbol()) {
        owner = _owner;
    }

    function _transfer(
        address _from,
        address _to,
        uint256 _amount
    ) internal override {
        require(_to != address(this), "LibToken: Can't transfer to the LIB contract itself");
        super._transfer(_from, _to, _amount);
    }

   function mint(address _to, uint256 _amount) external onlyOwner {
         console.log("inside parent mint");
         super._mint(_to, _amount);
    } 

    function burn(uint256 amount) external onlyOwner {
        super._burn(msg.sender, amount);
    }

    function decimals() public override pure returns (uint8) {
        return 18;
    }

    function rounding() public pure returns (uint8) {
        return 8;
    }

    function name() public override pure returns (string memory) {
        return "LibertyToken";
    }

    function symbol() public override pure returns (string memory) {
        return "LIB";
    }

}


