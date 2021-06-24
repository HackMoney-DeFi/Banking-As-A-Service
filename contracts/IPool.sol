pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";

/*
 * Abstract interface that describes the behaviors of what a Pool should do
 */
abstract contract IPool {

    function deposit(uint256 amount) external virtual;

    function withdraw(uint256 amount) external virtual;

    function transfer(address to, address from, uint256 amount) public virtual;
}