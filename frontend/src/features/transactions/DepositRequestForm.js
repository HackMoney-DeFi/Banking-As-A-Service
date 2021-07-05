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
            <div className="input-group mt-2">
                <span className="input-group-text">$</span>
                <input type="number" className="form-control" onChange={(e) => setDepositAmount(e.target.value)}  aria-label="Enter Amount" />
                <span className="input-group-text">USDC</span>
            </div>
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
