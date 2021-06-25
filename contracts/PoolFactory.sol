//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./Pool.sol";

/*
 * Main factory which is used to create other Pools
 */
contract PoolFactory {

    /*
     * Array to store created Pools
     */
    Pool[] public pools;

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
        pools.push(pool);
        emit PoolCreated(owner, amount);
    }

    /*
     * @dev Lists all the existing Pools
     */
    function listPools() public view returns(Pool[] memory) {
        return pools;
    }

    /*
     * @dev Gets the amount of liquidity in a Pool. Returns 0 if the Pool address is not found.
     * @param _address the address of the Pool we want the amount for
     */
    function getPoolAmount(address _address) public view returns(uint256) {
        for (uint256 i = 0; i < pools.length; i++) {
            if (pools[i].owner() == _address) {
                return pools[i].amount();
            }
        }
        return uint256(0);
    }

    /*
     * @dev Gets the total number of Pools created
     */
    function getPoolsSize() public view returns(uint256) {
        return pools.length;
    }
}
