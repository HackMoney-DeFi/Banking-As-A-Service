//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

/*
 * Abstract interface that describes the behaviors of what a Pool should do
 */
abstract contract IPool {

    function depositUSDC(
        address usdcAddress,
        address kTokenAddress,
        uint256 usdcAmount) external virtual;

    function withdrawInKoloToken(
        address usdcAddress,
        address kTokenAddress,
        uint256 kTokenAmount) external virtual;

    function addAdmin(address _address) external virtual;

    function removeAdmin(address _address) external virtual;

    function doUSDCTransfer(
        address usdcAddress,
        address kTokenAddress,
        address from,
        address to,
        uint256 amount) internal virtual returns (bool);
}