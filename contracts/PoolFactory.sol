pragma solidity ^0.8.0;

import "./Pool.sol";

/*
 * Added because a mapping object in Solidity creates a namespace where all keys exist.
 * As such, it is impossible to know if an address - which acts as a key - has already been
 * used for a Pool.
 */
library PoolTracker {
    struct config {
        uint256 amount;
        bool isCreated;
    }
}

/*
 * Main factory which is used to create other Pools
 */
contract PoolFactory is Initializable {

    /**
     * Keeps track of the created Pool objects in the mapping pools
     */
    using PoolTracker for PoolTracker.config;

    /**
     * Map that stores the address of pools along with how much liquidity they contain
     */
    mapping(address => PoolTracker.config) public pools;

    event PoolCreated(address owner, uint256 amount);

    function initialize(uint256 amount) public {
        require(!pools[msg.sender].isCreated, "This pool already exists.");
        createPool(msg.sender, amount);
    }

    function createPool(address owner, uint256 amount) public {
        Pool pool = new Pool(owner, amount);
        pools[owner].amount = amount;
        pools[owner].isCreated = true;
        emit PoolCreated(owner, amount);
    }
}