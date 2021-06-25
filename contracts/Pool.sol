//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./IPool.sol";

/*
 * Pool contract which acts as a reserve for liquidity and can be used for lending, borrowing,
 * investing and other financial operations.
 */
contract Pool is IPool {

    /**
     * Address where the Pool gets created
     */
    address public owner;

    /**
     * Total amount of liquidity in the Pool
     */
    uint256 public amount;

    constructor (address _owner) {
        owner = _owner;
    }

    function deposit(uint256 _amount) external override {
        //TODO: left intentionally blank
    }

    function withdraw(uint256 _amount) external override {
        //TODO: left intentionally blank
    }

    function transfer(address to, address from, uint256 _amount) public override {
        // TODO: left intentionally blank
    }
}