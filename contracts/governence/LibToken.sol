//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";


contract FedToken is ERC20PresetMinterPauser {

    constructor(string memory name, string memory symbol) ERC20PresetMinterPauser(name, symbol) {

    }

}


