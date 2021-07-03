//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Pool.sol";
import "hardhat/console.sol";

/*
 * Main factory which is used to create Pools
 */
contract PoolFactory {

    /*
     * Array to store all the created Pools
     */
    Pool[] public pools;
    
    // Address of the stakedToken contract
    address private StkToken;

    address private governence;

    /*
     * Minimum staked amount need to create a new NMLP
     */
    uint256 private minStakeAmount = 1000000000000000000000;

    constructor (address _stkToken, address _goverence) {
        StkToken = _stkToken;
        governence = _goverence;
    }

    /*
     * @dev Creates a Pool
     * @param name the name of the Pool
     * @param admins list of addresses that have ADMIN privileges
     */
    function createPool(string memory name, address[] memory admins) public returns (Pool) {
        uint256 stakedBalance = IERC20(StkToken).balanceOf(msg.sender);
        require(stakedBalance >= minStakeAmount, "Insufficient staked balance to create pool");

        KoloToken kToken = new KoloToken();
        Pool pool = new Pool(name, governence, admins, kToken);
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

    /*
    *@dev Gets the minimum stake amount to create a pool
    */
    function getMinStakeAmount() public view returns(uint256) {
        return minStakeAmount;
    }
}
