import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { closeSidePanel } from "../../redux/viewSlice";
import "./transactions.css";

const DepositForm = () => {
  const [depositAmount, setDepositAmount] = useState();

  return (
    <div className="transaction">
      <h5>Deposit</h5>
      <div className="transaction-form">
      <form>
        <div class="form-row align-items-center">
          <div class="col-auto">
            <label class="sr-only" for="lname">Deposit</label>
            <input onChange={(e) => setDepositAmount(e.target.value)} placeholder="Enter Amount" type="number" id="lname" name="lname" />
          </div>
          {
            depositAmount && (
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

export default DepositForm;
