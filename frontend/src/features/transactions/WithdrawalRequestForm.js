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
        <div class="form-row align-items-center">
          <div class="col-auto">
            <label class="sr-only" for="lname">Deposit</label>
            <input onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="Enter Amount" type="number" id="lname" name="lname" />
          </div>
          {
            withdrawAmount && (
            <div class="col-auto">
              <button class="btn btn-sm">Submit</button>
            </div>
            )
          }
        </div>
      </form>
      </div>
    </div>
  );
};

export default WidthdrawalRequestForm;
