//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "./IPool.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./KoloToken.sol";
import "./library/audit.sol";
import "hardhat/console.sol";

/*
 * Pool contract which acts as a reserve for liquidity and can be used for lending, borrowing,
 * investing and other financial operations.
 */
contract Pool is IPool, ReentrancyGuard {

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

    modifier onlyGoverner {
        require(msg.sender == governer, "Only Governence allowed operation");
        _;
    }
    
    modifier requireUserIsAdmin(address _address) {
        require(isAdmin[_address] == true,
            "User is not authorized to perform operation because they are not an Admin.");
        _;
    }

    modifier requireDepositOrWithdrawMoreThanZero(uint256 _amount) {
        require(_amount > 0, "Must deposit or withdraw more than zero.");
        _;
    }

    event AddedAdmin(address _address);

    event RemovedAdmin(address _adddress);
    
    event AddedAuditReport(AuditorReports.Audit _audit);

    event DepositedUSDC(address _address, uint256 usdcAmount);

    event WithdrewKOLO(address _address, uint256 kTokenAmount);

    constructor (
        string memory _name,
        address _governer,
        address[] memory _admins) {
        name = _name;
        governer = _governer;

        // Deep copy
        for (uint i = 0; i < _admins.length; i++) {
            isAdmin[_admins[i]] = true;
            totalAdmins += 1;
        }
    }

    /*
     * @dev deposits The underlying asset (currently USDC) into the reserve. A corresponding amount
     * of the overlying asset (KOLOs) is minted.
     * @param usdcAddress address of the usdcToken contract
     * @param kTokenAddress address of the KoloToken contract
     * @param usdcAmount the amount to be deposited
     */
    function depositUSDC(address usdcAddress, address kTokenAddress, uint256 usdcAmount) external
        nonReentrant
        requireDepositOrWithdrawMoreThanZero(usdcAmount)
        override {

        // Approve & transfer transaction.
        require(
            doUSDCTransfer(usdcAddress, kTokenAddress, msg.sender, address(this), usdcAmount),
                "Deposit not successful.");
        DepositedUSDC(msg.sender, usdcAmount);
        totalReserveBalance += usdcAmount;

        // Mint equivalent KOLO
        KoloToken(kTokenAddress).mint(msg.sender, usdcAmount);
    }
    
    function AddAuditReport(AuditorReports.Audit memory _audit) external onlyGoverner {
        audits.HistoricalAudits.push(_audit);
        emit AddedAuditReport(_audit);
    }

    /*
     * @dev Converts KOLO to USDC and transfers respective amounts to addresses
     * @param usdcAddress address of the usdcToken contract
     * @param kTokenAddress address of the KoloToken contract
     * @param kTokenAmount the amount to be withdrawn
     */
    function withdrawInKoloToken(address usdcAddress, address kTokenAddress, uint256 kTokenAmount)
        external
        nonReentrant
        requireDepositOrWithdrawMoreThanZero(kTokenAmount)
        override {

        // Validate transaction
        uint256 usdcAmount = convertKOLOToUSDC(kTokenAmount);
        validateAmountBelowLiquidityThreshold(usdcAmount);
        require(
            doUSDCTransfer(usdcAddress, kTokenAddress, address(this), msg.sender, usdcAmount),
            "Withdrawal not successful.");
        WithdrewKOLO(msg.sender, kTokenAmount);
        totalReserveBalance -= usdcAmount;

        // Burn KOLO
        KoloToken(kTokenAddress).burn(msg.sender, kTokenAmount);
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

    /*
     * @dev Transfers USDC tokens from KOLO balance
     * @param usdcAddress address of the USDC token contract
     * @param kTokenAddress address of the KOLO token contract
     * @param from sender address
     * @param to recipient address
     * @amount amount to be transfered
     */
    function doUSDCTransfer(
        address usdcAddress,
        address kTokenAddress,
        address from,
        address to,
        uint256 amount
    ) internal override returns (bool) {
        require(to != address(0), "Can't send to zero address.");
        IERC20 USDC = IERC20(usdcAddress);
        USDC.approve(kTokenAddress, amount);
        return USDC.transferFrom(from, to, amount);
    }

    function getTotalReserveBalance() external view returns (uint256) {
        return totalReserveBalance;
    }

    /*
     * @dev Current implementation has no notion of interest so returns 1:1
     * @param kTokenAmount amount of KOLO to convert
     */
    function convertKOLOToUSDC(uint256 kTokenAmount) private pure returns (uint256) {
        return kTokenAmount;
    }

    /*
     * @dev Validate that amount to withdraw is no more than 20% of Pool liquidity.
     * @usdcAmount amount of USDC to validate
     */
    function validateAmountBelowLiquidityThreshold(uint256 usdcAmount) private view {
        uint256 liquidityThreshold = (usdcAmount * 100000) / totalReserveBalance;
        require (liquidityThreshold <= 20000, "Cannot withdraw more than 20% of Pool balance.");
    }
}