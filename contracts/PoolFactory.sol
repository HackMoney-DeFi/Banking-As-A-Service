//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./Pool.sol";

/*
 * Main factory which is used to create other Pools
 */
contract PoolFactory {

    /*
     * Array to display all the existing Pools
     */
    Pool[] public poolList;

    /*
     * Map to store the address of a Pool and its content
     */
    mapping(address => Pool) public poolMap;

    event PoolCreated(address owner, uint256 amount);

    modifier onlyAmountGreaterThanZero(uint256 amount) {
        require(amount > 0, "Amount must be greater than 0.");
        _;
    }

    modifier requireSufficientBalance(address owner, uint256 amount) {
        require(owner.balance >= amount, "Insufficient balance for transaction.");
        _;
    }

    /*
     * @dev Creates a Pool
     * @param owner the address where the Pool gets created
     * @param amount the amount of initial liquidity provided in the Pool
     */
    function createPool(address owner, uint256 amount)
        public
        onlyAmountGreaterThanZero(amount)
        requireSufficientBalance(owner, amount)
    {
        Pool pool = new Pool(owner, amount);
        poolMap[owner] = pool;
        poolList.push(pool);
        emit PoolCreated(owner, amount);
    }

    /*
     * @dev Lists all the existing Pools
     */
    function listPools() public view returns(Pool[] memory) {
        return poolList;
    }

    /*
     * @dev Gets the amount of liquidity in a Pool
     * @param _address the address of the Pool we want the amount for
     */
    function getPoolAmount(address _address) public view returns(uint256) {
        return poolMap[_address].amount();
    }

    /*
     * @dev Gets the total number of Pools created
     */
    function getPoolsSize() public view returns(uint256) {
        return poolList.length;
    }
}
