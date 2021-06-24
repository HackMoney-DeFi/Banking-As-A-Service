pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "./IPool.sol";

/*
 * Pool contract which acts as a reserve for liquidity and can be used for lending, borrowing,
 * investing and other financial operations.
 */
contract Pool is Initializable, IPool {

    /**
     * Address where the Pool gets created
     */
    address public owner;

    /**
     * Total amount of liquidity in the Pool
     */
    uint256 public amount;

    function initialize(address _owner, uint256 _amount) public initializer {
        owner = _owner;
        amount = _amount;
    }

    function deposit(uint256 _amount) external override {
        //TODO: left intentionally blank
    }

    function withdraw(uint256 _amount) external override {
        //TODO: left intentionally blank
    }

    function transfer(address to, address from, uint256 amount) {
        // TODO: left intentionally blank
    }
}