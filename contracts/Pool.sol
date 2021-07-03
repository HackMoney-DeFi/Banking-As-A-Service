//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./interfaces/IPool.sol";
import "./library/audit.sol";
    

import "hardhat/console.sol";
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
    mapping(address => bool) public isAdmin;


    /*
     * Total number of admins in the Pool
     */
    uint256 public totalAdmins = uint256(0);

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

    modifier requireUserIsAdmin(address _address) {
        require(isAdmin[_address] == true,
            "User is not authorized to perform operation because they are not an Admin.");
        _;
    }

    event AddedAdmin(address _address);
    
    event RemovedAdmin(address _adddress);
    
    event AddedAuditReport(AuditorReports.Audit _audit);

    constructor (
        string memory _name,
        address _governer,
        address[] memory _admins
        ){

        name = _name;
        governer = _governer;
        
        // Deep copy
        for (uint i = 0; i < _admins.length; i++) {
            if (!isAdmin[_admins[i]]) 
                isAdmin[_admins[i]] = true;
                totalAdmins += 1;
        }
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

    function addAdmin(address _address) external override requireUserIsAdmin(msg.sender) {
        if (!isAdmin[_address])
            isAdmin[_address] = true;
            totalAdmins += 1;
            emit AddedAdmin(_address);
    }

    function removeAdmin(address _address) external override requireUserIsAdmin(msg.sender) {
        if (isAdmin[_address])
            delete isAdmin[_address];
            totalAdmins -= 1;
            emit RemovedAdmin(_address);
    }

    function getAudits() external view returns(AuditorReports.Reports memory) {
        return audits;
    }

    function transfer(address to, address from, uint256 _amount) public override {
        // TODO: left intentionally blank
    }
}