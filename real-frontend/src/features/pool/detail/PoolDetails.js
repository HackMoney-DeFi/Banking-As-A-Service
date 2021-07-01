import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeSidePanel, setSidePanel } from "../../../redux/viewSlice";
import DepositForm from "../../transactions/DepositRequestForm";
import WidthdrawalRequestForm from '../../transactions/WithdrawalRequestForm';

const PoolDetails = ({ name, amount, admins }) => {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.user.userId);

  const [isAdmin, setIsAdmin] = useState(admins.includes(userId));

  useEffect(() => {
    setIsAdmin(admins.includes(userId));
  }, [admins, userId]);

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
      <span>${amount}K</span>
      <span>Admins: {admins}</span>
      <DepositForm />
      {
        isAdmin && (
          <WidthdrawalRequestForm />
        )
      }
      <button className="btn mt-2" onClick={handleClose}>
        Close
      </button>
    </div>
  );
};

export default PoolDetails;
