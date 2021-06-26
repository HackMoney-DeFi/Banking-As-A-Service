//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./Pool.sol";

/*
 * Main factory which is used to create Pools
 */
contract PoolFactory {

    /*
     * Array to store all the created Pools
     */
    Pool[] public pools;

    /*
     * @dev Creates a Pool
     * @param name the name of the Pool
     * @param admins list of addresses that have ADMIN privileges
     */
    function createPool(string memory name, address[] memory admins) public returns (Pool) {
        Pool pool = new Pool(name, admins);
        pools.push(pool);
        return pool;
    }

    /*
     * @dev Lists all the existing Pools
     */
    function listPools() public view returns(Pool[] memory) {
        return pools;
    }

    /*
     * @dev Gets the total number of Pools created
     */
    function getNumPools() public view returns(uint256) {
        return pools.length;
    }
}
