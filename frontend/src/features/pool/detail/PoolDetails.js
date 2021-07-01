import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeSidePanel, setSidePanel } from "../../../redux/viewSlice";

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
      <span>{admins}</span>
      <button onClick={handleDeposit} className="btn mt-2">Deposit</button>
      {isAdmin && <button onClick={handleWithdraw} className="btn mt-2">Withdraw</button>}
      <button className="btn mt-2" onClick={handleClose}>
        Close
      </button>
    </div>
  );
};

export default PoolDetails;
