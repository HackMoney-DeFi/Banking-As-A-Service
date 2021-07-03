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

    /*
     * Address of the USDC contract
     */
    address private constant USDC_ADDRESS = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

    /*
     * Reference to the KoloToken contract
     */
    KoloToken private kToken;

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

    event Deposited(address _address, uint256 usdcAmount);

    event Withdrew(address _address, uint256 kTokenAmount);

    constructor (
        string memory _name,
        address _governer,
        address[] memory _admins,
        KoloToken _kToken) {
        name = _name;
        governer = _governer;
        kToken = _kToken;
        kToken.setAdminRole(address(this));

        // Deep copy
        for (uint i = 0; i < _admins.length; i++) {
            if (!isAdmin[_admins[i]])
                isAdmin[_admins[i]] = true;
                totalAdmins += 1;
        }
    }

    /*
     * @dev deposits The underlying asset (currently USDC) into the reserve. A corresponding amount
     * of the overlying asset (KOLOs) is minted.
     * @param amount amount of underlying asset to be deposited to the pool
     */
    function deposit(uint256 amount) external nonReentrant
        requireDepositOrWithdrawMoreThanZero(amount)
        override {

        // Approve & transfer transaction.
        require(
            transfer(msg.sender, address(this), amount),
                "Deposit not successful.");
        emit Deposited(msg.sender, amount);
        totalReserveBalance += amount;

        // Mint equivalent KOLO
        kToken.mintKOLO(msg.sender, amount);
    }
    
    function AddAuditReport(AuditorReports.Audit memory _audit) external onlyGoverner {
        audits.HistoricalAudits.push(_audit);
        emit AddedAuditReport(_audit);
    }

    /*
     * @dev Withdraws USDC by converting it from KOLO
     * @param amount the amount of KOLO to be withdrawn
     */
    function withdraw(uint256 amount) external nonReentrant
        requireDepositOrWithdrawMoreThanZero(amount)
        override {

        // Validate transaction
        uint256 usdcAmount = convertKOLOToUSDC(amount);
        validateAmountBelowLiquidityThreshold(usdcAmount);
        require(
            transfer(address(this), msg.sender, usdcAmount),
            "Withdrawal not successful.");
        emit Withdrew(msg.sender, amount);
        totalReserveBalance -= usdcAmount;

        // Burn KOLO
        kToken.burnKOLO(msg.sender, amount);
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
     * @dev Transfers USDC from one address to another
     * @param from sender address
     * @param to recipient address
     * @amount amount to be transferred
     */
    function transfer(
        address from,
        address to,
        uint256 amount
    ) internal override returns (bool) {
        require(to != address(0), "Can't send to zero address.");
        IERC20 USDC = IERC20(USDC_ADDRESS);
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