import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { closeSidePanel } from "../../redux/viewSlice";
import "./transactions.css";

const WidthdrawalRequestForm = () => {
  const [withdrawAmount, setWithdrawAmount] = useState();

  return (
    <div className="transaction">
      <h5>Withdraw</h5>
      <div className="transaction-form">
      <form>
        <div>
          <div>
            <label class="sr-only" for="lname">Deposit</label>
            <div className="input-group mt-2">
                <span className="input-group-text">$</span>
                <input type="number" className="form-control" onChange={(e) => setWithdrawAmount(e.target.value)}  aria-label="Enter Amount" />
                <span className="input-group-text">USDC</span>
            </div>
          </div>
          {
            withdrawAmount && (
              <button className="mt-2 btn w-100 accent-btn">Submit</button>
            )
          }
        </div>
      </form>
      </div>
    </div>
  );
};

export default WidthdrawalRequestForm;
