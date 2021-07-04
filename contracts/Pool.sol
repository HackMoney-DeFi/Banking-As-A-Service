//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./interfaces/IPool.sol";
import "./library/audit.sol";
import "./MultiSigWallet.sol";
    

import "hardhat/console.sol";
/*
 * Pool contract which acts as a reserve for liquidity and can be used for lending, borrowing,
 * investing and other financial operations.
 */
contract Pool is MultiSigWallet, IPool {


    /*
     * Total amount of liquidity that currently exists in the Pool
     */
    uint256 private totalReserveBalance = uint256(0);

    /*
     * Name of the Pool
     */
    string public name;

    /*
     * List of audit reports
     */

    AuditorReports.Reports internal audits;

    address private governer;
    

    /*
     * Map to keep track of how much a user has deposited to and withdrawn from the Pool
     */
    mapping(address => uint256) userBalance;
    
    modifier onlyGoverner {
        require(msg.sender == governer, "Only Governence allowed operation");
        _;
    }


    event AddedAdmin(address _address);
    
    event RemovedAdmin(address _adddress);
    
    event AddedAuditReport(AuditorReports.Audit _audit);

    constructor (
        string memory _name,
        address _governer,
        address[] memory _admins
        ) MultiSigWallet(_admins, 2) {

        name = _name;
        governer = _governer;
    }

    function AddAuditReport(AuditorReports.Audit memory _audit) external onlyGoverner {
        audits.HistoricalAudits.push(_audit);
        emit AddedAuditReport(_audit);
    }

    function deposit(uint256 _amount) external override {
        //TODO: left intentionally blank
    }

    function withdraw(uint256 _amount) external override {
        //TODO: left intentionally blank
    }

    function getAudits() external view returns(AuditorReports.Reports memory) {
        return audits;
    }

    function transfer(address to, uint256 _amount) internal override {
        // TODO: left intentionally blank
    }
}