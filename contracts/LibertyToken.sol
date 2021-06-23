//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

// We import this library to be able to use console.log
import "hardhat/console.sol";

contract LibertyToken is ERC20PresetMinterPauser {
        
    constructor(
        string memory name, 
        string memory symbol,
        uint256 initialSupply
    ) ERC20PresetMinterPauser(name, symbol) 
    {
        _mint(_msgSender(), initialSupply);
    }

}
