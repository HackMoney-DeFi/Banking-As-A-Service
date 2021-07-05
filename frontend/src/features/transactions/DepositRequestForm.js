import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { depositToPool } from "../../redux/poolSlice";
import { closeSidePanel } from "../../redux/viewSlice";
import "./transactions.css";

const DepositForm = ({ address }) => {
  const [depositAmount, setDepositAmount] = useState();
  const dispatch = useDispatch();

  const handleDeposit = () => {
    dispatch(depositToPool(address));
  }

  return (
    <div className="transaction">
      <h5>Deposit</h5>
      <div className="transaction-form">
      <form>
        <div>
          <div>
            <label class="sr-only" for="lname">Deposit</label>
            <input onChange={(e) => setDepositAmount(e.target.value)} placeholder="Enter Amount (USDC)" type="number" id="lname" name="lname" />
          </div>
          {
            depositAmount && (
              <button type="button" onClick={handleDeposit} class="mt-2 btn w-100 accent-btn">Submit</button>
            )
          }
        </div>
      </form>
      </div>
    </div>
  );
};

export default DepositForm;
