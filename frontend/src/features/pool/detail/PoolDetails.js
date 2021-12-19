import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeSidePanel, setSidePanel } from "../../../redux/viewSlice";
import DepositForm from "../../transactions/DepositRequestForm";
import WidthdrawalRequestForm from '../../transactions/WithdrawalRequestForm';
import LendRequestForm from '../../transactions/LendRequestForm';
import ReactTooltip from 'react-tooltip';
import { IoPerson } from "react-icons/io5";

const PoolDetails = ({ address, name, amount, admins, isAdmin }) => {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.user.userId);

  const handleClose = () => {
    dispatch(closeSidePanel());
  };

  const handleWithdraw = () => {
    dispatch(setSidePanel('withdraw'));
  };

  const handleDeposit = () => {
    dispatch(setSidePanel('deposit'));
  };

  return (
    <div className="pool-details d-flex flex-column">
      <h2>{name}</h2>
      <br />
        <div className="pool-info">
      <strong>Liquidity</strong>
      <span>
      {' '}
        ${amount}K</span>
        <br />
        <strong className="">Admins</strong>
      {' '}
      {admins.map(a => (
        <>
          <div data-tip={a} className="badge">
            <IoPerson />
          </div>
          <ReactTooltip />
        </>
      ))}
      <div>
      </div>
      </div>
      <DepositForm address={address} />
      {
        isAdmin && (
          <>
            <WidthdrawalRequestForm />
            <LendRequestForm address={address} />
          </>
        )
      }
      <button className="btn mt-5 btn-danger" onClick={handleClose}>
        Close
      </button>
    </div>
  );
};

export default PoolDetails;
