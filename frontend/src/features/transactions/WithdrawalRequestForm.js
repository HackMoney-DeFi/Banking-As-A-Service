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
            <input onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="Enter Amount (USDC)" type="number" id="lname" name="lname" />
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
