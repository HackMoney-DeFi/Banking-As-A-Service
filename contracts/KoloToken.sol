//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

/*
 * KoloToken (symbol: KOLO) is the name of our liquidity token, representing deposits made into a
 * specific pool. KOLO can be distributed among people who are, or are not, members of the pool.
 *
 * When a user deposits an underlying asset, an equivalent amount of KOLO is minted. When a user
 * withdraws, an equivalent amount of KOLO is burned.
 */
contract KoloToken is ERC20PresetMinterPauser {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    string private constant NAME = "KoloToken";

    string private constant SYMBOL = "KOLO";

    constructor() ERC20PresetMinterPauser(NAME, SYMBOL) {
    }

    function setAdminRole(address _owner) external {
        _setupRole(ADMIN_ROLE, _owner);
    }

    function mintKOLO(address from, uint256 amount) external {
        require(hasRole(ADMIN_ROLE, msg.sender), "Must have ADMIN role to mint.");
        _mint(from, amount);
    }

    function burnKOLO(address from, uint256 amount) external {
        require(hasRole(ADMIN_ROLE, msg.sender), "Must have ADMIN role to burn.");
        burnFrom(from, amount);
    }
}
