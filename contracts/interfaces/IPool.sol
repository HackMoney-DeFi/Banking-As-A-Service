//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

/*
 * Abstract interface that describes the behaviors of what a Pool should do
 */
abstract contract IPool {

    function deposit(uint256 amount) external virtual;

    function withdraw(uint256 amount) external virtual;

    // Transfer pooled fund to eoa account
    // Can only be executed by a multsig transaction 
    function transfer(address from, address to, uint256 amount) internal virtual returns (bool);

    function lend(address to, uint256 amount) internal virtual returns(bool);
}