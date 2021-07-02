//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/*
 * KoloToken (symbol: KOLO) is the name of our liquidity token, representing shares in the pool.
 * KOLO can be distributed among people who are, or are not, members of the pool.
 *
 * When a user deposits an underlying asset, an equivalent amount of KOLO is minted. When a user
 * withdraws, an equivalent amount of KOLO is burned.
 */
contract KoloToken is ERC20, ReentrancyGuard {

    address public kTokenAddress;

    string private constant NAME = "KoloToken";

    string private constant SYMBOL = "KOLO";

    // TODO: https://compound.finance/docs
    uint256 public exchangeRateMantissa = 1;
    uint256 public supplyRateManitssa = 1;

    constructor(address _address) ERC20(NAME, SYMBOL) {
        kTokenAddress = _address;
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) public {
        _burn(from, amount);
    }
}
