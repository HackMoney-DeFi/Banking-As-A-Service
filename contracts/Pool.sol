//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./IPool.sol";

/*
 * Pool contract which acts as a reserve for liquidity and can be used for lending, borrowing,
 * investing and other financial operations.
 */
contract Pool is IPool {

    /*
     * Total amount of liquidity that currently exists in the Pool
     */
    uint256 private totalReserveBalance = uint256(0);

    /*
     * Name of the Pool
     */
    string public name;

    /*
     * Map to keep track of users who have special roles such as managing funds and voting on loan requests
     */
    mapping(address => bool) public admins;

    /*
     * Map to keep track of how much a user has deposited to and withdrawn from the Pool
     */
    mapping(address => uint256) userBalance;

    modifier requireUserIsAdmin(address _address) {
        require(admins[_address] == true,
            "User is not authorized to perform operation because they are not an Admin.");
        _;
    }

    event AddedAdmin(address _address);

    event RemovedAdmin(address _adddress);

    constructor (string memory _name, address[] memory _admins) {
        name = _name;

        // Deep copy
        for (uint i = 0; i < _admins.length; i++) {
            admins[_admins[i]] = true;
        }
    }

    function deposit(uint256 _amount) external override {
        //TODO: left intentionally blank
    }

    function withdraw(uint256 _amount) external override {
        //TODO: left intentionally blank
    }

    function addAdmin(address _address) external override requireUserIsAdmin(msg.sender) {
        admins[_address] = true;
        emit AddedAdmin(_address);
    }

    function removeAdmin(address _address) external override requireUserIsAdmin(msg.sender) {
        delete admins[_address];
        emit RemovedAdmin(_address);
    }

    function transfer(address to, address from, uint256 _amount) public override {
        // TODO: left intentionally blank
    }
}